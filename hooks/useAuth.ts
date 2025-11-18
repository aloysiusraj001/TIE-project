import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { auth } from '../services/firebase';

export function useAuth() {
    // Fix: Use User type from firebase/compat/app
    const [user, setUser] = useState<firebase.User | null>(auth.currentUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fix: Use v8 compat API for onAuthStateChanged
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading };
}
