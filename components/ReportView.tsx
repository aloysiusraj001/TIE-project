import React from 'react';
import { TrainingSession, TranscriptEntry, PillarFeedback } from '../types';
import { BackIcon } from './icons';
import RadarChart from './RadarChart';
import { useLocale } from '../context/LocaleContext';

interface ReportViewProps {
  session: TrainingSession;
  onBack: () => void;
}

const TranscriptBubble: React.FC<{ entry: TranscriptEntry; personaName: string; }> = ({ entry, personaName }) => {
    const isUser = entry.speaker === 'user';

    const getGuestInitial = () => {
        if (!personaName) return 'G';
        const parts = personaName.split(' ');
        if (parts.length > 1 && parts[0] && parts[1]) {
            return parts[0][0] + parts[1][0];
        }
        return personaName[0] || 'G';
    }

    return (
        <div className={`flex items-start gap-3 my-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div title={isUser ? 'Trainee' : personaName} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isUser ? 'bg-brand-light text-brand-primary' : 'bg-brand-accent/50 text-white'}`}>
                {isUser ? 'YOU' : getGuestInitial()}
            </div>
            <div className={`p-3 rounded-lg max-w-lg ${isUser ? 'bg-brand-accent text-brand-primary' : 'bg-brand-accent/50 text-white'} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                <p className="text-sm font-semibold">{entry.text}</p>
            </div>
        </div>
    );
};

const ScoreIndicator: React.FC<{ score: number, maxScore?: number }> = ({ score, maxScore = 4 }) => (
    <div className="flex items-center gap-1">
        {Array.from({ length: maxScore }).map((_, i) => (
            <div key={i} className={`w-6 h-2 rounded-full ${i < score ? 'bg-brand-accent' : 'bg-brand-primary'}`} />
        ))}
        <span className="ms-2 font-bold text-brand-accent">{score}/{maxScore}</span>
    </div>
);


const PillarFeedbackCard: React.FC<{ pillarData: PillarFeedback }> = ({ pillarData }) => {
    const { t } = useLocale();
    return (
        <div className="bg-brand-primary p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-brand-text">{t(pillarData.pillar)}</h3>
                <ScoreIndicator score={pillarData.score} />
            </div>
            <p className="text-sm text-brand-light mb-2 italic">"{pillarData.feedback}"</p>
            <p className="text-sm text-green-400"><strong className="font-semibold">{t('suggestion')}:</strong> {pillarData.suggestion}</p>
        </div>
    );
};

const ReportView: React.FC<ReportViewProps> = ({ session, onBack }) => {
  const { locale, t } = useLocale();
  const { scenario, persona } = session;

  if (!scenario || !persona) {
    return (
      <div className="p-8 text-center">
        <p>Loading session data...</p>
        <button onClick={onBack}>Back</button>
      </div>
    )
  }

  // Define the desired order of pillars for the chart
  const pillarOrder = [
    "pillar.full.empathy",
    "pillar.full.personalization",
    "pillar.full.communication",
    "pillar.full.consistency",
    "pillar.full.ownership",
  ];

  // Sort the pillars from the session report according to the defined order
  const sortedPillars = [...session.report.pillars].sort((a, b) => {
    const aIndex = pillarOrder.indexOf(a.pillar);
    const bIndex = pillarOrder.indexOf(b.pillar);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  
  const chartData = sortedPillars.map(p => {
    const shortPillarKey = p.pillar.replace('.full.', '.') as keyof typeof import('../locales/en').en;
      return { 
          pillar: t(shortPillarKey), 
          score: p.score 
      };
  });
  const overallScore = session.report.pillars.reduce((acc, p) => acc + p.score, 0) / session.report.pillars.length;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-brand-light hover:text-white transition-colors">
        <BackIcon className="w-6 h-6" />
        <span>{t('backToDashboard')}</span>
      </button>

      <div className="bg-brand-secondary p-6 rounded-lg shadow-xl">
        <div className="flex items-center gap-4 border-b border-brand-accent/30 pb-4 mb-6">
            <span className="text-5xl">{scenario.avatar}</span>
            <div>
                <h1 className="text-3xl font-bold">{scenario.title[locale] || scenario.title.en}</h1>
                <p className="text-brand-light">{new Date(session.date).toLocaleString(locale)}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Chart and Summary */}
            <div className="flex flex-col items-center">
                 <h2 className="text-2xl font-bold mb-2">{t('performanceOverview')}</h2>
                 <p className="text-brand-light text-center mb-4">{session.report.summary}</p>
                 <RadarChart data={chartData} size={350} />
                 <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">{t('overallScore')}</h3>
                    <p className="text-3xl font-bold text-brand-accent">{overallScore.toFixed(1)} / 4.0</p>
                 </div>
            </div>

            {/* Right Column: Detailed Feedback */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('detailedFeedback')}</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pe-2">
                    {session.report.pillars.map((pillarData) => (
                        <PillarFeedbackCard key={pillarData.pillar} pillarData={pillarData} />
                    ))}
                </div>
            </div>
        </div>
        
        <div className="mt-8 border-t border-brand-accent/30 pt-6">
          <h2 className="text-2xl font-semibold mb-2">{t('conversationTranscript')}</h2>
          <div className="bg-brand-primary p-4 rounded-lg h-96 overflow-y-auto">
            {session.transcript.map((entry, index) => <TranscriptBubble key={index} entry={entry} personaName={persona.name} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;