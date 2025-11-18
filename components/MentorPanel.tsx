import React from 'react';
import { MentorFeedback } from '../types';
import { LightbulbIcon, ThumbsUpIcon } from './icons';
import { useLocale } from '../context/LocaleContext';

interface MentorPanelProps {
  feedback: MentorFeedback | null;
  isLoading: boolean;
}

const MentorPanel: React.FC<MentorPanelProps> = ({ feedback, isLoading }) => {
  const { t } = useLocale();

  if (!feedback) {
    return null;
  }

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-lg p-1 z-50">
      <div className="bg-brand-secondary rounded-lg shadow-2xl p-4 border border-brand-accent/30 relative min-h-[60px]">
        
        {/* Feedback Content */}
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
          {feedback.positive && (
            <div className="flex items-start gap-2">
              <ThumbsUpIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-brand-text">{feedback.positive}</p>
            </div>
          )}
          {feedback.positive && feedback.suggestion && <div className="my-2 border-t border-brand-primary"></div>}
          {feedback.suggestion && (
            <div className="flex items-start gap-2">
              <LightbulbIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-brand-text">
                <span className="font-semibold text-yellow-400">{t('suggestion')}:</span> {feedback.suggestion}
              </p>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-brand-secondary/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-brand-accent animate-pulse">
              <LightbulbIcon className="w-5 h-5" />
              <p className="text-sm font-semibold">{t('mentorThinking')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorPanel;