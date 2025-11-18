import React, { useState, useEffect, useMemo } from 'react';
import firebase from 'firebase/compat/app';
import { auth } from './services/firebase';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { useLocale } from './context/LocaleContext';

import Dashboard from './components/Dashboard';
import TrainingView from './components/TrainingView';
import ReportView from './components/ReportView';
import Login from './components/Login';
import LanguageSelector from './components/LanguageSelector';
import { AppView, TrainingSession, Scenario, TranscriptEntry, Report, TrainingMode, Persona, ScenarioCategory } from './types';
import { DashboardIcon, MicIcon, LogoIcon, UserIcon, LogoutIcon, AdminIcon } from './components/icons';
import { PERSONA_CHARACTERISTIC_OPTIONS, PERSONA_CONTRADICTION_RULES } from './constants';

const ADMIN_EMAILS = [
    'admin@frontlineboost.com',
    'aloysiusraj001@gmail.com',
    // Add more admin emails here
];
const VOICE_GENDERS: Record<Persona['voice'], 'male' | 'female' | 'neutral'> = {
  Kore: 'female',
  Puck: 'female',
  Charon: 'neutral',
  Fenrir: 'male',
  Zephyr: 'male',
};

// --- ADMIN UTILS & COMPONENTS ---

type PersonaField = keyof Persona | `behaviors_habits.${keyof Persona['behaviors_habits']}`;
type DisabledOptions = Partial<Record<keyof typeof PERSONA_CHARACTERISTIC_OPTIONS, string[]>>;

// Helper to get nested property value
const getNested = (obj: any, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

const getDisabledOptions = (persona: Persona): DisabledOptions => {
    const disabled: DisabledOptions = {};
    PERSONA_CONTRADICTION_RULES.forEach(rule => {
        const conditionValue = getNested(persona, rule.if.field);
        const conditionMet = Array.isArray(conditionValue)
            ? conditionValue.includes(rule.if.has)
            : conditionValue === rule.if.has;

        if (conditionMet) {
            const [consequenceField] = rule.then.field.split('.') as (keyof typeof PERSONA_CHARACTERISTIC_OPTIONS)[];
            if (!disabled[consequenceField]) {
                disabled[consequenceField] = [];
            }
            disabled[consequenceField]?.push(...rule.then.cannot_have);
        }
    });
    return disabled;
};

const applyContradictionRules = (persona: Persona): Persona => {
    let newPersona = { ...persona };
    let changed = true;
    // Loop until no more changes are made, to handle chained contradictions
    while(changed) {
        const personaBeforeLoop = JSON.stringify(newPersona);
        PERSONA_CONTRADICTION_RULES.forEach(rule => {
            const conditionValue = getNested(newPersona, rule.if.field);
            const conditionMet = Array.isArray(conditionValue)
                ? conditionValue.includes(rule.if.has)
                : conditionValue === rule.if.has;

            if (conditionMet) {
                const parts = rule.then.field.split('.');
                if (parts.length > 1) { // Nested property
                    const [key1, key2] = parts as [keyof Persona, keyof any];
                    const nestedObj = newPersona[key1] as any;
                    if (nestedObj && Array.isArray(nestedObj[key2])) {
                        nestedObj[key2] = nestedObj[key2].filter((item: string) => !rule.then.cannot_have.includes(item));
                    }
                } else {
                    const key = parts[0] as keyof Persona;
                    const value = newPersona[key];
                    if (Array.isArray(value)) {
                        // FIX: The `value` array can contain objects (e.g., from `lexicon_commented`), but `cannot_have.includes` expects a string.
                        // Added a type guard to only filter string array elements.
                        (newPersona[key] as any) = value.filter(item => {
                            if (typeof item === 'string') {
                                return !rule.then.cannot_have.includes(item);
                            }
                            return true;
                        });
                    } else if (typeof value === 'string' && rule.then.cannot_have.includes(value)) {
                        (newPersona[key] as any) = null;
                    }
                }
            }
        });
        changed = JSON.stringify(newPersona) !== personaBeforeLoop;
    }
    return newPersona;
};


const AdminView: React.FC<{
  scenarios: Scenario[];
  personas: Persona[];
  categories: ScenarioCategory[];
  onUpdateScenario: (scenario: Scenario) => Promise<void>;
  onUpdatePersona: (persona: Persona) => Promise<void>;
}> = ({ scenarios, personas, categories, onUpdateScenario, onUpdatePersona }) => {
    const { t } = useLocale();
    const [tab, setTab] = useState<'scenarios' | 'personas'>('scenarios');
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
    const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

    const handleScenarioSave = async (scenario: Scenario) => {
        await onUpdateScenario(scenario);
        setEditingScenario(null);
    };

    const handlePersonaSave = async (persona: Persona) => {
        await onUpdatePersona(persona);
        setEditingPersona(null);
    };
    
    if (editingScenario) {
        return <ScenarioEditor 
            scenario={editingScenario} 
            categories={categories}
            personas={personas}
            onSave={handleScenarioSave} 
            onCancel={() => setEditingScenario(null)} 
        />
    }

    if (editingPersona) {
        return <PersonaEditor 
            persona={editingPersona}
            onSave={handlePersonaSave}
            onCancel={() => setEditingPersona(null)}
        />
    }

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('adminPanel')}</h1>
            </div>
            <div className="flex border-b border-brand-light/20 mb-6">
                <button onClick={() => setTab('scenarios')} className={`py-2 px-4 text-lg ${tab === 'scenarios' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-light'}`}>{t('manageScenarios')}</button>
                <button onClick={() => setTab('personas')} className={`py-2 px-4 text-lg ${tab === 'personas' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-light'}`}>{t('managePersonas')}</button>
            </div>

            {tab === 'scenarios' && (
                <div className="space-y-4">
                    {scenarios.map(s => (
                        <div key={s.id} className="bg-brand-secondary p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{s.title.en}</p>
                                <p className="text-sm text-brand-light">{s.id}</p>
                            </div>
                            <button onClick={() => setEditingScenario(s)} className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-1 px-3 rounded">{t('edit')}</button>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'personas' && (
                 <div className="space-y-4">
                    {personas.map(p => (
                        <div key={p.id} className="bg-brand-secondary p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{p.name}</p>
                                <p className="text-sm text-brand-light">{p.id}</p>
                            </div>
                             <button onClick={() => setEditingPersona(p)} className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-1 px-3 rounded">{t('edit')}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ScenarioEditor: React.FC<{
    scenario: Scenario,
    categories: ScenarioCategory[],
    personas: Persona[],
    onSave: (scenario: Scenario) => void,
    onCancel: () => void
}> = ({ scenario, categories, personas, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        ...scenario,
        personaId: scenario.personaId || (personas.length > 0 ? personas[0].id : undefined)
    });
    const { t, locale } = useLocale();

    useEffect(() => {
        setFormData({
            ...scenario,
            personaId: scenario.personaId || (personas.length > 0 ? personas[0].id : undefined)
        });
    }, [scenario, personas]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocalizedStringChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'title' | 'description') => {
        const { lang } = e.target.dataset;
        const { value } = e.target;
        if (lang) {
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: value
                }
            }));
        }
    };
    
    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.split('\n').filter(s => s) }));
    };

    const handlePersonaIdChange = (id: string) => {
        setFormData(prev => ({ ...prev, personaId: id }));
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{t('editScenario')}: {scenario.title.en}</h2>
            <div className="space-y-4 bg-brand-secondary p-6 rounded-lg max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Basic Info */}
                <label className="block"><span className="text-brand-light">ID (cannot change)</span><input type="text" value={formData.id} readOnly className="form-input" /></label>
                <label className="block"><span className="text-brand-light">Avatar (Emoji)</span><input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="form-input" /></label>
                
                {/* Selectors */}
                <label className="block"><span className="text-brand-light">Category</span>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="form-input">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.title[locale] || c.title.en}</option>)}
                    </select>
                </label>

                {/* Persona Assignment */}
                <div>
                    <span className="text-brand-light block mb-2">{t('assignedPersonas')}</span>
                    <div className="space-y-2 p-3 bg-brand-primary border border-brand-light/20 rounded-md max-h-48 overflow-y-auto">
                        {personas.map(p => (
                            <label key={p.id} className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="radio"
                                    name="personaId"
                                    value={p.id}
                                    checked={formData.personaId === p.id}
                                    onChange={() => handlePersonaIdChange(p.id)}
                                    className="h-4 w-4 bg-brand-light/30 text-brand-accent focus:ring-brand-accent border-brand-light/50"
                                />
                                <span className="text-brand-text">{p.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Localized Strings */}
                <div><span className="text-brand-light">Title</span>
                    {Object.keys(formData.title).map(lang => (
                        <input key={lang} type="text" name={`title-${lang}`} data-lang={lang} value={formData.title[lang]} onChange={e => handleLocalizedStringChange(e, 'title')} className="form-input" placeholder={`Title (${lang})`} />
                    ))}
                </div>
                 <div><span className="text-brand-light">Description</span>
                    {Object.keys(formData.description).map(lang => (
                        <input key={lang} type="text" name={`description-${lang}`} data-lang={lang} value={formData.description[lang]} onChange={e => handleLocalizedStringChange(e, 'description')} className="form-input" placeholder={`Description (${lang})`} />
                    ))}
                </div>

                {/* Text Areas */}
                <label className="block"><span className="text-brand-light">System Instruction</span><textarea name="systemInstruction" value={formData.systemInstruction} onChange={handleChange} className="form-textarea" rows={5}></textarea></label>
                <label className="block"><span className="text-brand-light">Setting</span><textarea name="setting" value={formData.setting || ''} onChange={handleChange} className="form-textarea"></textarea></label>
                <label className="block"><span className="text-brand-light">Trigger Event</span><textarea name="trigger_event" value={formData.trigger_event || ''} onChange={handleChange} className="form-textarea"></textarea></label>
                <label className="block"><span className="text-brand-light">Key Challenge</span><textarea name="key_challenge" value={formData.key_challenge || ''} onChange={handleChange} className="form-textarea"></textarea></label>
                <label className="block"><span className="text-brand-light">Objective</span><textarea name="objective" value={formData.objective || ''} onChange={handleChange} className="form-textarea"></textarea></label>

                {/* Array Text Areas */}
                <label className="block"><span className="text-brand-light">Constraints (one per line)</span><textarea name="constraints" value={formData.constraints.join('\n')} onChange={handleArrayChange} className="form-textarea"></textarea></label>
                <label className="block"><span className="text-brand-light">Required Actions (one per line)</span><textarea name="required_actions" value={formData.required_actions.join('\n')} onChange={handleArrayChange} className="form-textarea"></textarea></label>
                <label className="block"><span className="text-brand-light">Desired Outcomes (one per line)</span><textarea name="desired_outcomes" value={formData.desired_outcomes.join('\n')} onChange={handleArrayChange} className="form-textarea"></textarea></label>
                <label className="block"><span className="text-brand-light">Critical Communication Points (one per line)</span><textarea name="critical_communication_points" value={formData.critical_communication_points.join('\n')} onChange={handleArrayChange} className="form-textarea"></textarea></label>
            </div>
            <div className="mt-4 flex gap-4">
                <button onClick={() => onSave(formData)} className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-2 px-4 rounded">{t('save')}</button>
                <button onClick={onCancel} className="bg-brand-light hover:bg-gray-400 text-brand-primary font-bold py-2 px-4 rounded">{t('cancel')}</button>
            </div>
            <style>{`.form-input, .form-textarea { width: 100%; background-color: #0D1B2A; color: #E0E1DD; padding: 8px; border-radius: 4px; border: 1px solid #778DA9; margin-top: 4px; }`}</style>
        </div>
    );
};

const SelectButtons: React.FC<{
    label: string;
    options: string[];
    selected: string[] | string | null;
    onChange: (newSelection: any) => void;
    disabledOptions?: string[];
    isMultiSelect?: boolean;
}> = ({ label, options, selected, onChange, disabledOptions = [], isMultiSelect = false }) => {
    
    const handleToggle = (option: string) => {
        if (isMultiSelect && Array.isArray(selected)) {
            const newSelection = selected.includes(option)
                ? selected.filter(item => item !== option)
                : [...selected, option];
            onChange(newSelection);
        } else {
            const newSelection = selected === option ? null : option;
            onChange(newSelection);
        }
    };

    return (
        <div>
            <span className="text-brand-light block mb-2">{label}</span>
            <div className="flex flex-wrap gap-2">
                {options.map(option => {
                    const isSelected = isMultiSelect ? (selected as string[])?.includes(option) : selected === option;
                    const isDisabled = disabledOptions.includes(option);
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleToggle(option)}
                            disabled={isDisabled}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                isDisabled 
                                ? 'bg-brand-primary text-brand-light/50 cursor-not-allowed border border-brand-light/20'
                                : isSelected 
                                ? 'bg-brand-accent text-brand-primary font-semibold' 
                                : 'bg-brand-primary hover:bg-brand-light/20 text-brand-light border border-brand-light/50'
                            }`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};


const PersonaEditor: React.FC<{
    persona: Persona,
    onSave: (persona: Persona) => void,
    onCancel: () => void
}> = ({ persona, onSave, onCancel }) => {
    const [formData, setFormData] = useState(persona);
    const { t } = useLocale();
    
    const disabledOptions = useMemo(() => getDisabledOptions(formData), [formData]);

    const handleUpdate = (updatedData: Partial<Persona>) => {
        const newFormData = { ...formData, ...updatedData };
        const cleanedData = applyContradictionRules(newFormData);
        setFormData(cleanedData);
    };

    // Effect to auto-select a valid voice if gender makes the current one invalid
    useEffect(() => {
        const currentVoiceGender = VOICE_GENDERS[formData.voice];
        const selectedGender = formData.gender;

        if (selectedGender && currentVoiceGender !== selectedGender && currentVoiceGender !== 'neutral') {
            const availableVoices = (Object.keys(VOICE_GENDERS) as Array<keyof typeof VOICE_GENDERS>).filter(voice => {
                const gender = VOICE_GENDERS[voice];
                return gender === selectedGender || gender === 'neutral';
            });
            if (availableVoices.length > 0) {
                handleUpdate({ voice: availableVoices[0] });
            }
        }
    }, [formData.gender, formData.voice]);

    // Effect to lock gender based on name prefix
    useEffect(() => {
        const name = formData.name.toLowerCase();
        let lockedGender: Persona['gender'] | null = null;
        if (name.startsWith('mrs.') || name.startsWith('ms.')) {
            lockedGender = 'female';
        } else if (name.startsWith('mr.')) {
            lockedGender = 'male';
        }

        if (lockedGender && formData.gender !== lockedGender) {
            handleUpdate({ gender: lockedGender });
        }
    }, [formData.name]);

    const isGenderLocked = useMemo(() => {
        const name = formData.name.toLowerCase();
        return name.startsWith('mrs.') || name.startsWith('ms.') || name.startsWith('mr.');
    }, [formData.name]);

    const availableVoices = (Object.keys(VOICE_GENDERS) as Array<keyof typeof VOICE_GENDERS>).filter(voice => {
        const voiceGender = VOICE_GENDERS[voice];
        return !formData.gender || voiceGender === formData.gender || voiceGender === 'neutral';
    });


    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{t('editPersona')}: {persona.name}</h2>
            <div className="space-y-6 bg-brand-secondary p-6 rounded-lg max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Simple Fields */}
                <label className="block"><span className="text-brand-light">ID (cannot change)</span><input type="text" value={formData.id} readOnly className="form-input" /></label>
                <label className="block"><span className="text-brand-light">Name</span><input type="text" name="name" value={formData.name} onChange={e => handleUpdate({ name: e.target.value })} className="form-input" /></label>
                
                <label className="block"><span className="text-brand-light">Gender</span>
                    <select name="gender" value={formData.gender || ''} onChange={e => handleUpdate({ gender: e.target.value as any })} disabled={isGenderLocked} className="form-input disabled:bg-brand-primary/50 disabled:cursor-not-allowed">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </label>
                 <label className="block"><span className="text-brand-light">Voice</span>
                    <select name="voice" value={formData.voice} onChange={e => handleUpdate({ voice: e.target.value as any })} className="form-input">
                        {availableVoices.map(voiceName => (
                            <option key={voiceName} value={voiceName}>{voiceName}</option>
                        ))}
                    </select>
                </label>
                <label className="block"><span className="text-brand-light">Video Avatar URL</span>
                    <input type="text" name="videoAvatar" value={formData.videoAvatar || ''} onChange={e => handleUpdate({ videoAvatar: e.target.value })} className="form-input" />
                </label>
                
                {/* Button-based Selects */}
                <SelectButtons
                    label="Background"
                    options={PERSONA_CHARACTERISTIC_OPTIONS.background}
                    selected={formData.background}
                    onChange={(selection) => handleUpdate({ background: selection })}
                    disabledOptions={disabledOptions.background}
                />
                <SelectButtons
                    label="Speaking Style"
                    options={PERSONA_CHARACTERISTIC_OPTIONS.speaking_style}
                    selected={formData.speaking_style}
                    onChange={(selection) => handleUpdate({ speaking_style: selection })}
                     disabledOptions={disabledOptions.speaking_style}
                />
                <SelectButtons 
                    label="Personality Traits"
                    isMultiSelect
                    options={PERSONA_CHARACTERISTIC_OPTIONS.personality_traits}
                    selected={formData.personality_traits}
                    onChange={(selection) => handleUpdate({ personality_traits: selection })}
                    disabledOptions={disabledOptions.personality_traits}
                />
                 <SelectButtons 
                    label="Pain Points / Frustrations"
                    isMultiSelect
                    options={PERSONA_CHARACTERISTIC_OPTIONS.pain_points_challenges}
                    selected={formData.pain_points_challenges}
                    onChange={(selection) => handleUpdate({ pain_points_challenges: selection })}
                    disabledOptions={disabledOptions.pain_points_challenges}
                />
            </div>
            <div className="mt-4 flex gap-4">
                <button onClick={() => onSave(formData)} className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-2 px-4 rounded">{t('save')}</button>
                <button onClick={onCancel} className="bg-brand-light hover:bg-gray-400 text-brand-primary font-bold py-2 px-4 rounded">{t('cancel')}</button>
            </div>
            <style>{`.form-input, .form-textarea { width: 100%; background-color: #0D1B2A; color: #E0E1DD; padding: 8px; border-radius: 4px; border: 1px solid #778DA9; margin-top: 4px; }`}</style>
        </div>
    );
}

// --- MAIN APP ---
// Fix: Use User type from firebase/compat/app
type User = firebase.User;

const AuthenticatedApp: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const { sessions, scenarios, personas, categories, hasCompletedAssessment, loading: dataLoading, addSession, updateAssessmentStatus, updateScenario, updatePersona } = useUserData(user);
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>(TrainingMode.ASSESSMENT);
  const [initialScenarioId, setInitialScenarioId] = useState<string | null>(null);
  const [initialPersonaId, setInitialPersonaId] = useState<string | null>(null);
  const { t } = useLocale();
  const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;

  const handleStartInitialAssessment = () => {
    const assessmentScenarioId = 'billing-dispute'; // This is "The Mysterious Minibar Charge"
    const assessmentPersonaId = 'mrs-davis'; // Always use Mrs. Davis as requested for the initial assessment.

    const assessmentScenario = scenarios.find(s => s.id === assessmentScenarioId);
    const assessmentPersona = personas.find(p => p.id === assessmentPersonaId);
    
    if (assessmentScenario && assessmentPersona) {
      setTrainingMode(TrainingMode.ASSESSMENT);
      setInitialScenarioId(assessmentScenarioId);
      setInitialPersonaId(assessmentPersonaId);
      setView(AppView.TRAINING);
    } else {
      if (!assessmentScenario) {
        alert(t('error.assessmentScenarioNotFound'));
      } else {
        // This indicates a data integrity issue if the seed persona is missing.
        alert("Critical error: The required 'Mrs. Davis' persona for the assessment could not be found. Please contact an administrator.");
      }
    }
  };

  const handleStartNewTraining = () => {
    setTrainingMode(TrainingMode.MENTORING);
    setInitialScenarioId(null);
    setInitialPersonaId(null);
    setView(AppView.TRAINING);
  };

  const handleViewReport = (session: TrainingSession) => {
    setCurrentSession(session);
    setView(AppView.REPORT);
  };

  const handleSessionComplete = async (scenarioId: string, personaId: string, transcript: TranscriptEntry[], report: Report) => {
    const newSessionData = {
      scenarioId,
      personaId,
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

  const navigateTo = (newView: AppView) => {
    setView(newView);
    setCurrentSession(null);
    setInitialScenarioId(null);
    setInitialPersonaId(null);
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
      case AppView.ADMIN:
        return isAdmin ? <AdminView scenarios={scenarios} personas={personas} categories={categories} onUpdateScenario={updateScenario} onUpdatePersona={updatePersona} /> : <p>Access Denied</p>;
      case AppView.TRAINING:
        return <TrainingView 
                    mode={trainingMode}
                    scenarios={scenarios}
                    personas={personas}
                    categories={categories}
                    initialScenarioId={initialScenarioId}
                    initialPersonaId={initialPersonaId}
                    onSessionComplete={handleSessionComplete} 
                    onBack={() => navigateTo(AppView.DASHBOARD)}
                />;
      case AppView.REPORT:
        if (!currentSession) return <Dashboard sessions={sessions} categories={categories} onStartNewTraining={handleStartNewTraining} onViewReport={handleViewReport} hasCompletedAssessment={hasCompletedAssessment} onStartInitialAssessment={handleStartInitialAssessment} />;
        return <ReportView session={currentSession} onBack={() => navigateTo(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard sessions={sessions} categories={categories} onStartNewTraining={handleStartNewTraining} onViewReport={handleViewReport} hasCompletedAssessment={hasCompletedAssessment} onStartInitialAssessment={handleStartInitialAssessment}/>;
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
                    <button onClick={() => navigateTo(AppView.DASHBOARD)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${view === AppView.DASHBOARD ? 'bg-brand-accent/80 text-white' : 'text-brand-light hover:bg-brand-accent/50 hover:text-white'}`}>
                        <DashboardIcon className="w-5 h-5" />
                        {t('dashboard')}
                    </button>
                    <button onClick={handleStartNewTraining} disabled={!hasCompletedAssessment} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${view === AppView.TRAINING ? 'bg-brand-accent/80 text-white' : 'text-brand-light hover:bg-brand-accent/50 hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                        <MicIcon className="w-5 h-5" />
                        {t('newTraining')}
                    </button>
                    {isAdmin && (
                        <button onClick={() => navigateTo(AppView.ADMIN)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${view === AppView.ADMIN ? 'bg-brand-accent/80 text-white' : 'text-brand-light hover:bg-brand-accent/50 hover:text-white'}`}>
                           <AdminIcon className="w-5 h-5" />
                           {t('adminPanel')}
                        </button>
                    )}
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