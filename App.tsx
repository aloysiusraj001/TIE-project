import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from './services/firebase';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { useLocale } from './context/LocaleContext';

import Dashboard from './components/Dashboard';
import TrainingView from './components/TrainingView';
import ReportView from './components/ReportView';
import Login from './components/Login';
import LanguageSelector from './components/LanguageSelector';
import { AppView, TrainingSession, Scenario, TranscriptEntry, Report, TrainingMode } from './types';
import { DashboardIcon, MicIcon, LogoIcon, UserIcon, LogoutIcon } from './components/icons';
import { SCENARIOS } from './constants';


const AuthenticatedApp: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const { sessions, hasCompletedAssessment, loading: dataLoading, addSession, updateAssessmentStatus } = useUserData(user);
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>(TrainingMode.ASSESSMENT);
  const [initialScenario, setInitialScenario] = useState<Scenario | null>(null);
  const { t } = useLocale();

  const handleStartInitialAssessment = () => {
    const assessmentScenario = SCENARIOS.find(s => s.id === 'angry-guest');
    if (assessmentScenario) {
        setTrainingMode(TrainingMode.ASSESSMENT);
        setInitialScenario(assessmentScenario);
        setView(AppView.TRAINING);
    } else {
        alert("Assessment scenario not found!");
    }
  };

  const handleStartNewTraining = () => {
    setTrainingMode(TrainingMode.MENTORING);
    setInitialScenario(null); // Let the user choose
    setView(AppView.TRAINING);
  };

  const handleViewReport = (session: TrainingSession) => {
    setCurrentSession(session);
    setView(AppView.REPORT);
  };

  const handleSessionComplete = async (scenario: Scenario, transcript: TranscriptEntry[], report: Report) => {
    const newSessionData: Omit<TrainingSession, 'id'> = {
      scenario,
      transcript,
      report,
      date: new Date().toISOString(),
    };
    const newSession = await addSession(newSessionData);
    setCurrentSession(newSession);

    if (trainingMode === TrainingMode.ASSESSMENT) {
        await updateAssessmentStatus(true);
    }

    setView(AppView.REPORT);
  };

  const navigateToDashboard = () => {
    setView(AppView.DASHBOARD);
    setCurrentSession(null);
    setInitialScenario(null);
  };

  const renderView = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-accent"></div>
        </div>
      );
    }

    switch (view) {
      case AppView.TRAINING:
        return <TrainingView 
                    mode={trainingMode} 
                    initialScenario={initialScenario}
                    onSessionComplete={handleSessionComplete} 
                    onBack={navigateToDashboard} 
                />;
      case AppView.REPORT:
        return currentSession ? <ReportView session={currentSession} onBack={navigateToDashboard} /> : <Dashboard sessions={sessions} onStartNewTraining={handleStartNewTraining} onViewReport={handleViewReport} hasCompletedAssessment={hasCompletedAssessment} onStartInitialAssessment={handleStartInitialAssessment} />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard sessions={sessions} onStartNewTraining={handleStartNewTraining} onViewReport={handleViewReport} hasCompletedAssessment={hasCompletedAssessment} onStartInitialAssessment={handleStartInitialAssessment}/>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary text-brand-text font-sans">
      <header className="bg-brand-secondary shadow-md">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center">
                <LogoIcon className="h-8 w-auto me-3" />
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-brand-light font-light">frontline</span>
                  <span className="text-brand-accent">boost</span>
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-6">
                <nav className="hidden sm:flex space-x-4">
                    <button onClick={navigateToDashboard} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${view === AppView.DASHBOARD ? 'bg-brand-accent/80 text-white' : 'text-brand-light hover:bg-brand-accent/50 hover:text-white'}`}>
                        <DashboardIcon className="w-5 h-5" />
                        {t('dashboard')}
                    </button>
                    <button onClick={handleStartNewTraining} disabled={!hasCompletedAssessment} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${view === AppView.TRAINING ? 'bg-brand-accent/80 text-white' : 'text-brand-light hover:bg-brand-accent/50 hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                        <MicIcon className="w-5 h-5" />
                        {t('newTraining')}
                    </button>
                </nav>
                 <div className="flex items-center space-x-3">
                    <LanguageSelector />
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="User" className="h-9 w-9 rounded-full" />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-brand-light flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-brand-primary" />
                        </div>
                    )}
                    <button onClick={() => auth.signOut()} title={t('signOut')} className="text-brand-light hover:text-white p-2 rounded-full hover:bg-brand-primary transition-colors">
                        <LogoutIcon className="h-5 w-5" />
                    </button>
                </div>
              </div>
          </div>
      </header>
      <main>
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-primary">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-accent"></div>
        </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <AuthenticatedApp user={user} />;
};


export default App;
