import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Scenario, TranscriptEntry, Report, TrainingMode, MentorFeedback, ScenarioCategory, Persona } from '../types';
import { getAiInstance, generateTrainingReport, generateMentorFeedback } from '../services/geminiService';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
import { MicIcon, StopIcon, BackIcon } from './icons';
import { useLocale } from '../context/LocaleContext';
import MentorPanel from './MentorPanel';


interface TrainingViewProps {
  mode: TrainingMode;
  scenarios: Scenario[];
  personas: Persona[];
  categories: ScenarioCategory[];
  initialScenarioId: string | null;
  initialPersonaId: string | null;
  onSessionComplete: (scenarioId: string, personaId: string, transcript: TranscriptEntry[], report: Report) => void;
  onBack: () => void;
}

const ScenarioSelector: React.FC<{ 
    scenarios: Scenario[]; 
    categories: ScenarioCategory[];
    onSelect: (scenario: Scenario) => void; 
    onBack: () => void; 
}> = ({ scenarios, categories, onSelect, onBack }) => {
    const { locale, t } = useLocale();
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-brand-light hover:text-white transition-colors">
                <BackIcon className="w-6 h-6" />
                <span>{t('backToDashboard')}</span>
            </button>
            <h1 className="text-3xl font-bold text-center mb-10">{t('chooseScenario')}</h1>
            <div className="space-y-12">
                {categories.map(category => (
                    <div key={category.id}>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-brand-accent">{category.title[locale] || category.title.en}</h2>
                            <p className="text-brand-light mt-1">{category.description[locale] || category.description.en}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {scenarios.filter(s => s.categoryId === category.id).map((scenario) => (
                                <div
                                    key={scenario.id}
                                    className="bg-brand-secondary p-6 rounded-lg shadow-lg cursor-pointer hover:bg-brand-accent/50 transition-all transform hover:-translate-y-1"
                                    onClick={() => onSelect(scenario)}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-4xl">{scenario.avatar}</span>
                                        <h3 className="text-xl font-bold">{scenario.title[locale] || scenario.title.en}</h3>
                                    </div>
                                    <p className="text-brand-light text-sm">{scenario.description[locale] || scenario.description.en}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const createDynamicSystemInstruction = (scenario: Scenario, persona: Persona): string => {
    const personaDetails = `
    --- YOUR PERSONA ---
    - Name: ${persona.name}
    - Background: ${persona.background}
    - Personality Traits: ${persona.personality_traits.join(', ')}
    - Speaking Style: ${persona.speaking_style}
    - Key Frustrations: ${persona.pain_points_challenges.join(', ')}
    - Communication Style: ${persona.behaviors_habits.communication_preferences.join(', ')}
    --- END OF PERSONA ---
    `;
    const personaEmbodimentInstruction = 'You must fully embody the persona details provided to you. Express feelings and reactions based on your character. Do not break character.';

    return `${scenario.systemInstruction}\n\n${personaEmbodimentInstruction}\n\n${personaDetails}`;
};


const TrainingSessionComponent: React.FC<{ mode: TrainingMode; scenario: Scenario, persona: Persona, onComplete: (transcript: TranscriptEntry[]) => void, onBack: () => void }> = ({ mode, scenario, persona, onComplete, onBack }) => {
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentUserUtterance, setCurrentUserUtterance] = useState('');
    const [mentorFeedback, setMentorFeedback] = useState<MentorFeedback | null>(null);
    const [isMentorLoading, setIsMentorLoading] = useState(false);
    const { locale, t } = useLocale();
    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const ai = useRef<GoogleGenAI | null>(null);
    const sessionPromise = useRef<Promise<any> | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const outputNode = useRef<GainNode | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    const nextStartTime = useRef(0);
    
    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    useEffect(() => {
        ai.current = getAiInstance();
        outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        outputNode.current = outputAudioContext.current.createGain();
        outputNode.current.connect(outputAudioContext.current.destination);

        if (mode === TrainingMode.MENTORING) {
            const initialTips: string[] = [t('initialTip1'), t('initialTip2'), t('initialTip3')];
            const randomTip = initialTips[Math.floor(Math.random() * initialTips.length)];
            setMentorFeedback({ positive: t('initialTipPositive'), suggestion: randomTip });
        }

        return () => {
            stopRecording(true);
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [transcript, currentUserUtterance]);


    const startRecording = async () => {
        if (isRecording || !ai.current || !outputAudioContext.current || !outputNode.current) return;
        setIsRecording(true);
        
        try {
            const dynamicInstruction = createDynamicSystemInstruction(scenario, persona);

            const connectPromise = ai.current.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => console.log('Session opened.'),
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                            setCurrentUserUtterance(currentInputTranscription.current);
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            setCurrentUserUtterance('');
                            const userText = currentInputTranscription.current.trim();
                            const aiText = currentOutputTranscription.current.trim();
                            
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';

                            let newEntries: TranscriptEntry[] = [];
                            if (userText) newEntries.push({ speaker: 'user', text: userText });
                            if (aiText) newEntries.push({ speaker: 'ai', text: aiText });
                            
                            if(newEntries.length > 0) {
                                setTranscript(prev => [...prev, ...newEntries]);
                            }

                            if (mode === TrainingMode.MENTORING && userText) {
                                setIsMentorLoading(true);
                                const currentTranscript = [...transcript, ...newEntries];
                                const feedback = await generateMentorFeedback(currentTranscript);
                                setMentorFeedback(feedback);
                                setIsMentorLoading(false);
                            }
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContext.current && outputNode.current) {
                            const oac = outputAudioContext.current;
                            nextStartTime.current = Math.max(nextStartTime.current, oac.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), oac, 24000, 1);
                            const source = oac.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode.current);
                            source.addEventListener('ended', () => { sources.current.delete(source); });
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            sources.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            for (const source of sources.current.values()) { source.stop(); }
                            sources.current.clear();
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => console.error('Session error:', e),
                    onclose: (e: CloseEvent) => console.log('Session closed.'),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: persona.voice } } },
                    systemInstruction: dynamicInstruction,
                },
            });

            sessionPromise.current = connectPromise;
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            mediaStreamSource.current = audioContext.current.createMediaStreamSource(mediaStream.current);
            scriptProcessor.current = audioContext.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                connectPromise.then((session) => { session.sendRealtimeInput({ media: pcmBlob }); });
            };
            
            mediaStreamSource.current.connect(scriptProcessor.current);
            scriptProcessor.current.connect(audioContext.current.destination);

        } catch (error) {
            console.error("Error starting recording:", error);
            setIsRecording(false);
        }
    };

    const stopRecording = async (isCleanup = false) => {
        if (!isRecording && !isCleanup) return;
        setIsRecording(false);

        if (scriptProcessor.current) {
            scriptProcessor.current.onaudioprocess = null;
            scriptProcessor.current.disconnect();
            scriptProcessor.current = null;
        }
        if (mediaStreamSource.current) {
            mediaStreamSource.current.disconnect();
            mediaStreamSource.current = null;
        }
        if (audioContext.current && audioContext.current.state !== 'closed') {
            audioContext.current.close();
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        if (sessionPromise.current) {
            try {
                const session = await sessionPromise.current;
                session.close();
            } catch(e) { console.error("Error closing session", e)}
            sessionPromise.current = null;
        }
        if(outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
           for (const source of sources.current.values()) { source.stop(); }
           sources.current.clear();
           if(isCleanup) { outputAudioContext.current.close(); }
        }
    };

    const handleFinishSession = async () => {
        await stopRecording();
        setIsProcessing(true);
        const finalTranscript = [...transcript];
        if (currentInputTranscription.current.trim()) {
            finalTranscript.push({ speaker: 'user', text: currentInputTranscription.current.trim() });
        }
        if (currentOutputTranscription.current.trim()) {
            finalTranscript.push({ speaker: 'ai', text: currentOutputTranscription.current.trim() });
        }
        onComplete(finalTranscript);
    };

    const getGuestInitial = () => {
        const name = persona.name;
        if (!name) return 'G';
        const parts = name.split(' ');
        if (parts.length > 1 && parts[0] && parts[1]) { return parts[0][0] + parts[1][0]; }
        return name[0];
    }
    
    const modeText = mode === TrainingMode.ASSESSMENT ? t('assessment') : t('conversation');
    const gridColsClass = mode === TrainingMode.MENTORING ? "lg:grid-cols-2" : "lg:grid-cols-2";

    return (
        <div className="p-4 sm:p-8 max-w-full mx-auto h-[calc(100vh-120px)]">
             <div className={`grid grid-cols-1 ${gridColsClass} gap-8 h-full`}>
                <div className="flex items-center justify-center bg-brand-secondary rounded-lg p-4 h-full">
                    {persona.videoAvatar ? (
                        <video key={persona.videoAvatar} src={persona.videoAvatar} autoPlay loop muted playsInline className="w-full h-full object-contain rounded-lg"/>
                    ) : (
                        <div className="text-9xl">{scenario.avatar}</div>
                    )}
                </div>
                
                <div className="flex flex-col h-full relative">
                    <div className="flex justify-between items-start mb-4">
                        <button onClick={onBack} className="flex items-center gap-2 text-brand-light hover:text-white transition-colors flex-shrink-0">
                            <BackIcon className="w-6 h-6" />
                            <span>{mode === TrainingMode.ASSESSMENT ? t('backToDashboard') : t('changeScenario')}</span>
                        </button>
                        <div className="text-end">
                            <h2 className="text-2xl font-bold">{scenario.title[locale] || scenario.title.en}</h2>
                            <p className="text-brand-light text-sm mt-1">
                                {t('speakingWith', { name: persona.name })}
                            </p>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="flex-grow bg-brand-secondary rounded-lg p-4 overflow-y-auto mb-4">
                        {transcript.length === 0 && !isRecording && !currentUserUtterance && (
                            <div className="flex items-center justify-center h-full text-center text-brand-light">
                                <p>{t('startPrompt', { mode: modeText, name: persona.name })}</p>
                            </div>
                        )}
                        {transcript.map((entry, index) => (
                            <div key={index} className={`flex items-start gap-3 my-3 ${entry.speaker === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div title={entry.speaker === 'user' ? 'Trainee' : persona.name} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${entry.speaker === 'user' ? 'bg-brand-light text-brand-primary' : 'bg-brand-accent/50 text-white'}`}>
                                    {entry.speaker === 'user' ? 'YOU' : getGuestInitial()}
                                </div>
                                <div className={`p-3 rounded-lg max-w-md ${entry.speaker === 'user' ? 'bg-brand-accent text-brand-primary' : 'bg-brand-accent/50 text-white'} ${entry.speaker === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                    <p className="text-sm font-semibold">{entry.text}</p>
                                </div>
                            </div>
                        ))}
                        {currentUserUtterance && (
                            <div className="flex items-start gap-3 my-3 flex-row-reverse">
                                <div title="Trainee" className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-brand-light text-brand-primary">
                                    YOU
                                </div>
                                <div className="p-3 rounded-lg max-w-md bg-brand-accent rounded-br-none opacity-70">
                                    <p className="text-sm italic font-semibold text-brand-primary">{currentUserUtterance}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {mode === TrainingMode.MENTORING && (
                        <MentorPanel feedback={mentorFeedback} isLoading={isMentorLoading} />
                    )}

                    <div className="flex-shrink-0 flex flex-col items-center justify-center">
                        {isProcessing ? (
                            <div className="text-center">
                                <p className="text-lg mb-2">{t('analyzingPerformance')}</p>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={isRecording ? () => stopRecording() : startRecording}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${ isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-accent hover:bg-brand-accent-hover' }`}
                                >
                                    {isRecording ? <StopIcon className="w-10 h-10 text-white" /> : <MicIcon className="w-10 h-10 text-brand-primary" />}
                                </button>
                                <p className="mt-2 text-sm text-brand-light">{isRecording ? t('recording') : t('tapToSpeak')}</p>
                                {transcript.length > 0 && !isRecording && (
                                    <button onClick={handleFinishSession} className="mt-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-2 px-6 rounded-lg">
                                        {t('finishAndGetReport')}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const TrainingView: React.FC<TrainingViewProps> = ({ mode, scenarios, personas, categories, initialScenarioId, initialPersonaId, onSessionComplete, onBack }) => {
  const { t } = useLocale();

  // State for the selected entities for the training session.
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  // This effect runs once to set up the initial state for assessments.
  useEffect(() => {
    if (mode === TrainingMode.ASSESSMENT && initialScenarioId && initialPersonaId) {
      const scenario = scenarios.find(s => s.id === initialScenarioId);
      const persona = personas.find(p => p.id === initialPersonaId);
      if (scenario && persona) {
        setActiveScenario(scenario);
        setActivePersona(persona);
      }
    }
  }, [mode, initialScenarioId, initialPersonaId, scenarios, personas]);

  const handleScenarioSelect = (scenario: Scenario) => {
    if (scenario.personaId) {
      const persona = personas.find(p => p.id === scenario.personaId);
      if (persona) {
        setActiveScenario(scenario);
        setActivePersona(persona);
      } else {
        // Data integrity error, persona assigned in admin doesn't exist.
        alert(t('error.personaNotFoundForScenario'));
      }
    } else {
      // Admin hasn't assigned a persona to this scenario.
      alert(t('error.noPersonaAssignedToScenario'));
    }
  };

  const handleSessionCompletion = async (transcript: TranscriptEntry[]) => {
    if (!activeScenario || !activePersona) return;
    const report = await generateTrainingReport(transcript);
    onSessionComplete(activeScenario.id, activePersona.id, transcript, report);
  };

  const handleBackFromSession = () => {
    if (mode === TrainingMode.MENTORING) {
      // In mentoring mode, go back to the scenario selector.
      setActiveScenario(null);
      setActivePersona(null);
    } else {
      // In assessment mode, go back to the dashboard.
      onBack();
    }
  };

  const isSessionReady = activeScenario && activePersona;

  if (isSessionReady) {
    return (
      <TrainingSessionComponent 
        mode={mode}
        scenario={activeScenario} 
        persona={activePersona}
        onComplete={handleSessionCompletion} 
        onBack={handleBackFromSession}
      />
    );
  }

  // If session is not ready, and it's mentoring mode, show selector.
  if (mode === TrainingMode.MENTORING) {
    return (
      <ScenarioSelector 
        scenarios={scenarios} 
        categories={categories} 
        onSelect={handleScenarioSelect} 
        onBack={onBack} 
      />
    );
  }

  // Otherwise (assessment mode waiting for effect), show nothing or a loader.
  return null;
};

export default TrainingView;