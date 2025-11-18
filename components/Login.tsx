import React, { useState } from 'react';
import { auth, firestore } from '../services/firebase';
import { LogoIcon } from './icons';
import { useLocale } from '../context/LocaleContext';
import LanguageSelector from './LanguageSelector';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
            setError(t('error.auth/missing-name'));
            setIsLoading(false);
            return;
        }
        // Fix: Use v8 compat API for Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user) {
          throw new Error("User creation failed.");
        }

        // Update auth profile with display name
        // Fix: Use v8 compat API for Authentication
        await user.updateProfile({
          displayName: fullName,
        });

        // Create user document in Firestore with additional details
        // Fix: Use v8 compat API for Firestore
        const userDocRef = firestore.collection('users').doc(user.uid);
        await userDocRef.set({
            hasCompletedAssessment: false,
            email: user.email,
            name: fullName,
            organisation: organisation,
            createdAt: new Date().toISOString()
        });

      } else {
        // Fix: Use v8 compat API for Authentication
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (err: any) {
      const errorCode = `error.${err.code}` as keyof typeof import('../locales/en').en;
      setError(t(errorCode, { default: t('error.unexpected') }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError(t('error.auth/missing-email'));
      setResetMessage(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      // Fix: Use v8 compat API for Authentication
      await auth.sendPasswordResetEmail(email);
      setResetMessage(t('resetLinkSent'));
    } catch (err: any) {
      const errorCode = `error.${err.code}` as keyof typeof import('../locales/en').en;
      setError(t(errorCode, { default: t('error.unexpected') }));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-primary p-4">
      <div className="absolute top-4 end-4">
          <LanguageSelector />
      </div>
      <div className="text-center max-w-md w-full bg-brand-secondary p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center items-center mb-6">
            <LogoIcon className="h-16 w-auto me-3" />
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-brand-light font-light">frontline</span>
              <span className="text-brand-accent">boost</span>
            </h1>
        </div>
        <p className="text-brand-light mb-8">
            {isSignUp ? t('createAccountPrompt') : t('signInPrompt')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('fullName')}
                required
                className="w-full bg-brand-primary text-brand-text px-4 py-3 rounded-lg border border-brand-light/20 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-label={t('fullName')}
              />
              <input
                type="text"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                placeholder={t('organisation')}
                className="w-full bg-brand-primary text-brand-text px-4 py-3 rounded-lg border border-brand-light/20 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-label={t('organisation')}
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailAddress')}
            required
            className="w-full bg-brand-primary text-brand-text px-4 py-3 rounded-lg border border-brand-light/20 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label={t('emailAddress')}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            required
            className="w-full bg-brand-primary text-brand-text px-4 py-3 rounded-lg border border-brand-light/20 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label={t('password')}
          />

          {!isSignUp && (
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isLoading}
                className="text-sm text-brand-light hover:text-brand-accent transition-colors disabled:opacity-50"
              >
                {t('forgotPassword')}
              </button>
            </div>
          )}
          
          <div className="h-5 text-center">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {resetMessage && <p className="text-green-400 text-sm">{resetMessage}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (isSignUp ? t('creatingAccount') : t('signingIn')) : (isSignUp ? t('signUp') : t('signIn'))}
          </button>
        </form>

        <div className="mt-6">
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setResetMessage(null);
            }}
            className="text-sm text-brand-light hover:text-brand-accent transition-colors"
          >
            {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;