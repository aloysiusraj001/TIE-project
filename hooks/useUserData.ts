import { useState, useEffect, useCallback } from 'react';
import { firestore } from '../services/firebase';
import type { User } from 'firebase/auth';
import { TrainingSession, Scenario, Persona, ScenarioCategory } from '../types';
import { seedPersonas, seedScenarios, SCENARIO_CATEGORIES } from '../constants';

export function useUserData(user: User | null) {
    const [sessions, setSessions] = useState<TrainingSession[]>([]);
    // Initialize state with seed data to prevent it from being empty on initial render,
    // which could cause errors if data fetching from Firestore is delayed or fails.
    const [scenarios, setScenarios] = useState<Scenario[]>(seedScenarios);
    const [personas, setPersonas] = useState<Persona[]>(seedPersonas);
    const [categories] = useState<ScenarioCategory[]>(SCENARIO_CATEGORIES);
    const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // --- FETCH ALL DATA ---
            // Fix: Use v8 compat API for Firestore
            const scenariosColRef = firestore.collection('scenarios');
            const allScenariosSnap = await scenariosColRef.get();
            const appScenarios = allScenariosSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Scenario));
            // Only update state if Firestore returns data, otherwise keep the initial seed data.
            if (appScenarios.length > 0) {
              setScenarios(appScenarios);
            }
            
            // Fix: Use v8 compat API for Firestore
            const personasColRef = firestore.collection('personas');
            const allPersonasSnap = await personasColRef.get();
            const appPersonas = allPersonasSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Persona));
            // Only update state if Firestore returns data.
            if (appPersonas.length > 0) {
              setPersonas(appPersonas);
            }

            // Fetch user profile (assessment status)
            // Fix: Use v8 compat API for Firestore
            const userDocRef = firestore.collection('users').doc(user.uid);
            const userDocSnap = await userDocRef.get();
            if (userDocSnap.exists) {
                setHasCompletedAssessment(userDocSnap.data()?.hasCompletedAssessment || false);
            } else {
                // Fix: Use v8 compat API for Firestore
                await userDocRef.set({ 
                    hasCompletedAssessment: false, 
                    email: user.email, 
                    name: user.displayName || user.email,
                    createdAt: new Date().toISOString()
                });
                setHasCompletedAssessment(false);
            }

            // Fetch sessions
            // Fix: Use v8 compat API for Firestore
            const sessionsColRef = firestore.collection('users').doc(user.uid).collection('sessions');
            const q = sessionsColRef.orderBy('date', 'desc');
            const sessionsSnap = await q.get();
            const userSessions = sessionsSnap.docs.map(docSnap => {
                const data = docSnap.data();
                // Use the most up-to-date scenario/persona data for mapping, falling back to seed data if fetch failed.
                const currentScenarios = appScenarios.length > 0 ? appScenarios : seedScenarios;
                const currentPersonas = appPersonas.length > 0 ? appPersonas : seedPersonas;
                const fullScenario = currentScenarios.find(s => s.id === data.scenarioId);
                const fullPersona = currentPersonas.find(p => p.id === data.personaId);
                return { 
                    ...data, 
                    id: docSnap.id,
                    scenario: fullScenario,
                    persona: fullPersona,
                } as TrainingSession
            });
            setSessions(userSessions);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addSession = async (sessionData: Omit<TrainingSession, 'id' | 'scenario' | 'persona'>): Promise<TrainingSession> => {
        if (!user) throw new Error("User not authenticated.");
        // Fix: Use v8 compat API for Firestore
        const sessionsColRef = firestore.collection('users').doc(user.uid).collection('sessions');
        const docRef = await sessionsColRef.add(sessionData);
        
        const fullScenario = scenarios.find(s => s.id === sessionData.scenarioId);
        const fullPersona = personas.find(p => p.id === sessionData.personaId);

        const newSession: TrainingSession = { ...sessionData, id: docRef.id, scenario: fullScenario, persona: fullPersona };
        setSessions(prev => [newSession, ...prev.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())]);
        return newSession;
    };

    const updateAssessmentStatus = async (status: boolean) => {
        if (!user) throw new Error("User not authenticated.");
        // Fix: Use v8 compat API for Firestore
        const userDocRef = firestore.collection('users').doc(user.uid);
        await userDocRef.set({ hasCompletedAssessment: status }, { merge: true });
        setHasCompletedAssessment(status);
    };

    const updateScenario = async (scenario: Scenario): Promise<void> => {
        const { id, ...data } = scenario;
        // Fix: Use v8 compat API for Firestore
        const scenarioDocRef = firestore.collection('scenarios').doc(id);
        await scenarioDocRef.set(data, { merge: true });
        setScenarios(prev => prev.map(s => s.id === id ? scenario : s));
    };

    const updatePersona = async (persona: Persona): Promise<void> => {
        const { id, ...data } = persona;
        // Fix: Use v8 compat API for Firestore
        const personaDocRef = firestore.collection('personas').doc(id);
        await personaDocRef.set(data, { merge: true });
        setPersonas(prev => prev.map(p => p.id === id ? persona : p));
    };

    return { sessions, scenarios, personas, categories, hasCompletedAssessment, loading, addSession, updateAssessmentStatus, updateScenario, updatePersona };
}
