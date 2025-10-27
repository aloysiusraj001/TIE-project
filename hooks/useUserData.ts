import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { User } from 'firebase/auth';
import { TrainingSession } from '../types';

export function useUserData(user: User | null) {
    const [sessions, setSessions] = useState<TrainingSession[]>([]);
    const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserData = useCallback(async () => {
        if (!user) {
            setSessions([]);
            setHasCompletedAssessment(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Fetch user profile (assessment status)
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                setHasCompletedAssessment(userDocSnap.data().hasCompletedAssessment || false);
            } else {
                // Create user doc if it doesn't exist
                await setDoc(userDocRef, { 
                    hasCompletedAssessment: false, 
                    email: user.email, 
                    name: user.displayName || user.email,
                    createdAt: new Date().toISOString()
                });
                setHasCompletedAssessment(false);
            }

            // Fetch sessions
            const sessionsColRef = collection(firestore, 'users', user.uid, 'sessions');
            const q = query(sessionsColRef, orderBy('date', 'desc'));
            const sessionsSnap = await getDocs(q);
            const userSessions = sessionsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as TrainingSession));
            setSessions(userSessions);

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);
    
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const addSession = async (sessionData: Omit<TrainingSession, 'id'>): Promise<TrainingSession> => {
        if (!user) throw new Error("User not authenticated.");
        const sessionsColRef = collection(firestore, 'users', user.uid, 'sessions');
        const docRef = await addDoc(sessionsColRef, sessionData);
        const newSession: TrainingSession = { ...sessionData, id: docRef.id };
        setSessions(prev => [newSession, ...prev]);
        return newSession;
    };

    const updateAssessmentStatus = async (status: boolean) => {
        if (!user) throw new Error("User not authenticated.");
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, { hasCompletedAssessment: status }, { merge: true });
        setHasCompletedAssessment(status);
    };

    return { sessions, hasCompletedAssessment, loading, addSession, updateAssessmentStatus };
}
