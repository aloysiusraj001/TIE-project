import { GoogleGenAI, Type } from '@google/genai';
import { Report, TranscriptEntry, MentorFeedback } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiInstance = () => {
    return ai;
};

const rubric = `
Frontline Customer Handling Rubric (5 Pillars Framework)
Pillar / Criterion	Excellent (4)	Good (3)	Developing (2)	Needs Improvement (1)
1. Proactive Empathy & Attentiveness	Anticipates guest needs before requests; responds warmly and promptly with full emotional awareness.	Responds politely and promptly but mainly after guest cues.	Offers basic assistance, needs reminders for follow-up or tone calibration.	Misses guest cues, reacts mechanically, shows little emotional presence.
2. Communication Clarity & Emotional Intelligence	Communicates clearly with positive tone, adapting language and emotion to each guest’s mood and culture.	Communication is polite and effective though sometimes lacks tone awareness.	Struggles with phrasing or controlling tone under stress.	Displays unclear, rushed, or inappropriate communication.
3. Service Recovery & Ownership	Applies LEARN (Listen, Empathize, Apologize, Resolve, Notify) flawlessly; takes full ownership and ensures guest satisfaction.	Addresses problems well with minimal guidance, but lacks proactive follow-up.	Needs coaching to handle guest issues or delays in resolution.	Fails to acknowledge responsibility or inadequately resolves concerns.
4. Consistency & Attention to Detail	Executes tasks with total accuracy and constant brand alignment; preempts potential errors.	Follows SOPs correctly with rare mistakes and good reliability.	Inconsistent accuracy or occasionally misses steps in SOPs.	Frequent errors and lack of attention compromise service quality.
5. Personalization & Memory Creation	Creates memorable, uniquely personalized experiences that surprise and delight guests.	Personalizes standard service interactions effectively.	Performs standard service adequately but lacks personalization.	Provides robotic service with no sense of personal engagement.
`;


export const generateTrainingReport = async (transcript: TranscriptEntry[]): Promise<Report> => {
    const conversation = transcript.map(entry => `${entry.speaker === 'user' ? 'Student' : 'AI Guest'}: ${entry.text}`).join('\n');
    
    const prompt = `
        As an expert hotel management trainer, analyze the following conversation between a frontline staff trainee and an AI-simulated guest.
        The conversation may be in any language, but your analysis and the JSON output must be in English.
        Evaluate the student's performance against the provided "Frontline Customer Handling Rubric (5 Pillars Framework)".

        **Rubric:**
        ${rubric}

        **Conversation:**
        ${conversation}
        
        Provide a concise, constructive performance report. For each of the 5 pillars, provide a score from 1 to 4, a brief feedback narrative explaining the score, and one concrete suggestion for improvement. Also provide a brief overall summary of the performance.
        Return the analysis ONLY in the structured JSON format as requested. The 'pillar' field in the JSON must be one of the following exact keys: "pillar.full.empathy", "pillar.full.communication", "pillar.full.ownership", "pillar.full.consistency", "pillar.full.personalization".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: 'A brief overall summary of the student\'s performance.',
                        },
                        pillars: {
                            type: Type.ARRAY,
                            description: 'An array of feedback for each of the 5 pillars.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    pillar: {
                                        type: Type.STRING,
                                        description: 'The key for the rubric pillar.',
                                    },
                                    score: {
                                        type: Type.INTEGER,
                                        description: 'The score for this pillar, from 1 to 4.',
                                    },
                                    feedback: {
                                        type: Type.STRING,
                                        description: 'Narrative feedback explaining the score for this pillar.',
                                    },
                                    suggestion: {
                                        type: Type.STRING,
                                        description: 'A concrete suggestion for improvement for this pillar.',
                                    },
                                },
                                required: ['pillar', 'score', 'feedback', 'suggestion'],
                            },
                        },
                    },
                    required: ['summary', 'pillars'],
                },
            },
        });

        const jsonText = response.text.trim();
        const reportData = JSON.parse(jsonText);
        
        // Basic validation
        if (reportData.summary && Array.isArray(reportData.pillars) && reportData.pillars.length === 5) {
            return reportData;
        } else {
            console.error("Invalid report format received from API", reportData);
            throw new Error("Invalid report format received from API");
        }

    } catch (error) {
        console.error("Error generating training report:", error);
        // Fallback in case of API error
        return {
            summary: "Could not generate a full report due to an API error. Please check the console for details and try again.",
            pillars: [
                { pillar: "pillar.full.empathy", score: 0, feedback: "N/A", suggestion: "N/A" },
                { pillar: "pillar.full.communication", score: 0, feedback: "N/A", suggestion: "N/A" },
                { pillar: "pillar.full.ownership", score: 0, feedback: "N/A", suggestion: "N/A" },
                { pillar: "pillar.full.consistency", score: 0, feedback: "N/A", suggestion: "N/A" },
                { pillar: "pillar.full.personalization", score: 0, feedback: "N/A", suggestion: "N/A" },
            ],
        };
    }
};

export const generateMentorFeedback = async (transcript: TranscriptEntry[]): Promise<MentorFeedback> => {
    const conversation = transcript.map(entry => `${entry.speaker === 'user' ? 'Student' : 'Guest'}: ${entry.text}`).join('\n');
    const lastUserUtterance = transcript.slice().reverse().find(e => e.speaker === 'user')?.text || '';

    const prompt = `
        You are an expert hotel management coach, whispering live, real-time advice to a trainee during a simulation. The feedback must be in English.
        The trainee is interacting with an AI guest. Here is the conversation transcript so far:
        ---
        ${conversation}
        ---
        The trainee's most recent statement was: "${lastUserUtterance}"

        Your task is to provide **immediate, ultra-concise feedback** based ONLY on their last statement in the context of the conversation.

        1.  **Positive Reinforcement:** Identify one thing they did well. Be specific but brief (e.g., "Great use of an empathetic tone."). If they did nothing noteworthy, leave this blank.
        2.  **Actionable Suggestion:** Provide one clear, forward-looking tip for their *next* move (e.g., "Now, offer them a concrete choice of solutions."). If their last response was perfect, leave this blank.

        Prioritize the most critical piece of feedback for this exact moment. Both fields should be extremely concise (max 10 words).
        Return your response ONLY in the specified JSON format.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        positive: {
                            type: Type.STRING,
                            description: 'A short, positive reinforcement for the user\'s last action.',
                        },
                        suggestion: {
                            type: Type.STRING,
                            description: 'A short, actionable suggestion for the user\'s next action.',
                        }
                    },
                    required: ['positive', 'suggestion']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating mentor feedback:", error);
        return {
            positive: "Could not get feedback at this time.",
            suggestion: "Please continue the conversation."
        };
    }
};