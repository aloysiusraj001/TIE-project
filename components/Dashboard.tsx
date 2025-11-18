import React from 'react';
import { TrainingSession, ScenarioCategory } from '../types';
import { ReportIcon, MicIcon } from './icons';
import { useLocale } from '../context/LocaleContext';

interface DashboardProps {
  sessions: TrainingSession[];
  categories: ScenarioCategory[];
  onStartNewTraining: () => void;
  onViewReport: (session: TrainingSession) => void;
  hasCompletedAssessment: boolean;
  onStartInitialAssessment: () => void;
}

const PerformanceSummary: React.FC<{ sessions: TrainingSession[] }> = ({ sessions }) => {
    const { t } = useLocale();

    const pillarOrder = [
        "pillar.full.empathy",
        "pillar.full.communication",
        "pillar.full.ownership",
        "pillar.full.consistency",
        "pillar.full.personalization",
    ];

    if (sessions.length === 0) return null;

    const pillarScores: { [key: string]: number[] } = {};
    sessions.forEach(session => {
        if (session.report && session.report.pillars) {
            session.report.pillars.forEach(p => {
                if (!pillarScores[p.pillar]) {
                    pillarScores[p.pillar] = [];
                }
                pillarScores[p.pillar].push(p.score);
            });
        }
    });

    const summaryData = pillarOrder.map(pillarKey => {
        const scores = pillarScores[pillarKey] || [];
        const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const shortPillarKey = pillarKey.replace('.full.', '.') as keyof typeof import('../locales/en').en;
        return {
            pillar: t(shortPillarKey),
            averageScore,
        };
    });

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{t('overallPerformanceSummary')}</h2>
            <div className="bg-brand-secondary p-6 rounded-lg space-y-4 shadow-lg">
                {summaryData.map(item => (
                    <div key={item.pillar}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-brand-text">{item.pillar}</span>
                            <span className="text-sm font-bold text-brand-accent">{item.averageScore.toFixed(1)} / 4.0</span>
                        </div>
                        <div className="w-full bg-brand-primary rounded-full h-2.5">
                            <div
                                className="bg-brand-accent h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${(item.averageScore / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SessionCard: React.FC<{ session: TrainingSession; onClick: () => void, categories: ScenarioCategory[] }> = ({ session, onClick, categories }) => {
    const { locale, t } = useLocale();
    if (!session.scenario) return null; // Don't render if scenario data is missing

    const category = categories.find(c => c.id === session.scenario.categoryId);

    return (
        <div 
            className="bg-brand-secondary p-4 rounded-lg shadow-lg hover:bg-brand-accent/50 transition-colors cursor-pointer"
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    {category && (
                         <p className="text-xs font-bold uppercase text-brand-accent tracking-wider mb-1">{category.title[locale] || category.title.en}</p>
                    )}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{session.scenario.avatar}</span>
                        <h3 className="text-lg font-bold text-brand-text">{session.scenario.title[locale] || session.scenario.title.en}</h3>
                    </div>
                    <p className="text-sm text-brand-light mt-1 ps-10">{new Date(session.date).toLocaleString(locale)}</p>
                </div>
                <div className="flex items-center gap-2 text-brand-light hover:text-white mt-1 flex-shrink-0">
                    <span>{t('viewReport')}</span>
                    <ReportIcon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

const InitialAssessmentCard: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    const { t } = useLocale();
    return (
        <div className="bg-brand-secondary rounded-lg p-8 text-center shadow-2xl border-2 border-brand-accent/50">
            <h2 className="text-3xl font-bold text-brand-text mb-2">{t('welcome')}</h2>
            <p className="text-brand-light mb-6 max-w-2xl mx-auto">
                {t('assessmentIntro')}
            </p>
            <button
                onClick={onStart}
                className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 inline-flex items-center gap-3 text-lg"
            >
                <MicIcon className="w-6 h-6" />
                {t('startInitialAssessment')}
            </button>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, categories, onStartNewTraining, onViewReport, hasCompletedAssessment, onStartInitialAssessment }) => {
  const { t } = useLocale();
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!hasCompletedAssessment) {
      return (
          <div className="p-4 sm:p-8 flex items-center justify-center h-[calc(100vh-200px)]">
              <InitialAssessmentCard onStart={onStartInitialAssessment} />
          </div>
      );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">{t('trainingDashboard')}</h1>
        <button
          onClick={onStartNewTraining}
          className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          {t('newMentoredTraining')}
        </button>
      </div>

      <PerformanceSummary sessions={sessions} />

      <div>
        <h2 className="text-2xl font-bold mb-4">{t('sessionHistory')}</h2>
        <div className="space-y-4">
            {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => (
                <SessionCard key={session.id} session={session} onClick={() => onViewReport(session)} categories={categories} />
            ))
            ) : (
            <div className="text-center py-16 bg-brand-secondary rounded-lg">
                <h2 className="text-2xl font-semibold text-brand-light">{t('noSessions')}</h2>
                <p className="mt-2 text-brand-light">{t('noSessionsPrompt')}</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
