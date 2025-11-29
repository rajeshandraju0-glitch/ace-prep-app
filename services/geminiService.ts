
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, RecruitmentItem, QuizQuestion, StudyPlan, PYQItem, NotificationItem, TestConfig } from "../types";
import { ODISHA_PYQ_DATABASE } from "../data/odishaPYQData";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Fetches the latest current affairs using Gemini with Google Search grounding.
 */
export const fetchLatestCurrentAffairs = async (): Promise<{ items: NewsItem[]; sources: any[] }> => {
  try {
    const today = new Date().toDateString();
    const prompt = `
      Find the top 6 most important current affairs news headlines and summaries relevant for competitive exams (UPSC, OPSC, OSSSC, Banking) for the last 3 days (up to ${today}).
      
      CRITICAL SOURCES: Prioritize specific updates from 'Odisha TV', 'Sambad English', 'Prameya News', 'The Samaja', and official 'Odisha Government Press Releases'.
      
      CRITICAL CONTENT: Ensure at least 2 of the items are specifically related to Odisha state (new government schemes, cabinet decisions, OPSC/OSSSC notifications, state awards, appointments).
      
      Format the output strictly as a list of items separated by "|||".
      Each item must follow this format:
      TITLE: <title>
      DATE: <date>
      CATEGORY: <category>
      SUMMARY: <summary>
      
      Do not add any markdown formatting like bold or code blocks around the list. Just raw text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Parse the structured text
    const items: NewsItem[] = [];
    const rawItems = text.split('|||').map(s => s.trim()).filter(s => s.length > 0);

    rawItems.forEach((raw, index) => {
      const titleMatch = raw.match(/TITLE:\s*(.*)/);
      const dateMatch = raw.match(/DATE:\s*(.*)/);
      const catMatch = raw.match(/CATEGORY:\s*(.*)/);
      const summaryMatch = raw.match(/SUMMARY:\s*(.*)/s); // /s for multiline

      if (titleMatch) {
        items.push({
          id: `news-${index}`,
          title: titleMatch[1].trim(),
          date: dateMatch ? dateMatch[1].trim() : 'Recent',
          category: catMatch ? catMatch[1].trim() : 'General',
          summary: summaryMatch ? summaryMatch[1].trim() : raw,
        });
      }
    });

    return { items, sources: groundingChunks };

  } catch (error) {
    console.error("Error fetching current affairs:", error);
    throw error;
  }
};

/**
 * Fetches latest recruitment notifications.
 */
export const fetchLatestRecruitments = async (): Promise<{ items: RecruitmentItem[]; sources: any[] }> => {
  try {
    const today = new Date().toDateString();
    const prompt = `
      Search for the latest active government and private job recruitment notifications released in the last 14 days (up to ${today}).
      
      OFFICIAL SOURCES MANDATORY - Check these domains specifically:
      1. ossc.gov.in (Odisha Staff Selection Commission) - LOOK HERE FIRST
      2. upsc.gov.in (Union Public Service Commission)
      3. ibps.in (Institute of Banking Personnel Selection)
      4. opsc.gov.in & osssc.gov.in (Odisha Public/Sub-ordinate Commissions)
      
      PRIORITY: List any active notification from OSSC, UPSC, or IBPS found in the last 2 weeks.
      
      Format each job strictly as follows, separated by "###":
      ROLE: <Job Role/Title>
      ORG: <Organization Name>
      DEADLINE: <Application Deadline>
      ELIGIBILITY: <Short Eligibility Criteria>
      LINK: <Official Link or "Search online">
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const items: RecruitmentItem[] = [];
    const rawItems = text.split('###').map(s => s.trim()).filter(s => s.length > 0);

    rawItems.forEach((raw, index) => {
      const role = raw.match(/ROLE:\s*(.*)/)?.[1];
      const org = raw.match(/ORG:\s*(.*)/)?.[1];
      const deadline = raw.match(/DEADLINE:\s*(.*)/)?.[1];
      const eligibility = raw.match(/ELIGIBILITY:\s*(.*)/)?.[1];
      const link = raw.match(/LINK:\s*(.*)/)?.[1];

      if (role && org) {
        items.push({
          id: `job-${index}`,
          title: role.trim(),
          organization: org.trim(),
          deadline: deadline?.trim() || 'See details',
          eligibility: eligibility?.trim() || 'N/A',
          link: link?.trim() || '#',
        });
      }
    });

    return { items, sources: groundingChunks };

  } catch (error) {
    console.error("Error fetching recruitments:", error);
    throw error;
  }
};

/**
 * Generates a quiz based on advanced test configuration.
 */
export const generateQuiz = async (config: TestConfig): Promise<QuizQuestion[]> => {
  try {
    let promptContext = "";
    
    if (config.type === 'MOCK') {
        let patternDescription = "";
        switch (config.exam) {
            case 'OPSC Civil Services':
            case 'UPSC':
                patternDescription = `
                    Strictly follow the General Studies Paper 1 pattern:
                    - History (Ancient/Medieval/Modern India + Odisha History for OPSC)
                    - Geography (Physical/Economic + Odisha Geography for OPSC)
                    - Indian Polity & Governance
                    - Economic & Social Development
                    - General Science & Environment
                `;
                break;
            case 'Banking (IBPS PO)':
            case 'Banking (SBI PO)':
                patternDescription = `
                    Strictly follow the IBPS/SBI Prelims pattern:
                    - Quantitative Aptitude (Data Interpretation, Arithmetic, Series)
                    - Reasoning Ability (Puzzles, Syllogism, Blood Relations)
                    - English Language (Error Spotting, Fillers, Para Jumbles)
                `;
                break;
            case 'OSSC CGL':
            case 'OSSC Combined':
            case 'Odisha Police':
                 patternDescription = `
                    Strictly follow the OSSC/State Exam pattern:
                    - General Knowledge (Current Affairs, Odisha GK)
                    - Reasoning & Mental Ability
                    - Mathematics / Numerical Ability
                    - Computer Awareness
                 `;
                 break;
            default:
                 patternDescription = `Cover all major syllabus topics for ${config.exam}.`;
        }

        promptContext = `
            Create a "Full Length Mock Test Series" subset of ${config.questionCount} questions for the "${config.exam}" exam.
            
            ${patternDescription}
            
            Ensure the difficulty matches the real exam level.
        `;
    } else if (config.type === 'SUBJECT') {
        promptContext = `
            Create ${config.questionCount} questions specifically for the subject "${config.subject}" relevant to "${config.exam}".
            Ensure questions vary in difficulty (Easy, Medium, Hard).
        `;
    } else if (config.type === 'CHAPTER') {
        promptContext = `
            Create ${config.questionCount} questions deeply focused on the chapter/topic "${config.topic}" within the subject "${config.subject}" for "${config.exam}".
        `;
    }

    const prompt = `
      ${promptContext}
      
      OUTPUT FORMAT:
      Return a strict JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.STRING, description: "The correct option text exactly as it appears in options" },
              explanation: { type: Type.STRING },
              subject: { type: Type.STRING, description: "The subject category (e.g., History, Reasoning) of this question" }
            },
            required: ["question", "options", "correctAnswer", "explanation", "subject"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

/**
 * Generates a personalized study plan.
 */
export const generateStudyPlan = async (exam: string, level: string, hours: number): Promise<StudyPlan | null> => {
  try {
    const prompt = `
      Create a 5-day personalized study plan for a student preparing for "${exam}" (specifically focusing on Odisha exams if applicable).
      The student is at a "${level}" level and has ${hours} hours per day.
      
      REQUIREMENTS:
      1. Include a mix of static GK, Current Affairs, and Aptitude.
      2. EXPLICITLY schedule 'MCQ Practice' sessions every day.
      3. For OSSC/UPSC/IBPS exams, include specific pattern practice (e.g., Reasoning Puzzles for IBPS, Answer Writing for UPSC).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exam: { type: Type.STRING },
            duration: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyPlan;
    }
    return null;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

/**
 * Fetches/Generates Previous Year Questions.
 * Uses a Hybrid approach: Checks local static data first, then AI.
 */
export const fetchPYQs = async (exam: string, subject: string, year?: string): Promise<PYQItem[]> => {
  try {
    // 1. Check Local Database (Static Data)
    let localQuestions = ODISHA_PYQ_DATABASE.filter(q => {
        const examMatch = q.exam.toLowerCase().includes(exam.split(' ')[0].toLowerCase()); // Partial match for exam name
        const yearMatch = year ? q.year === year : true;
        const subjectMatch = subject === 'General Studies' ? true : q.question.toLowerCase().includes(subject.toLowerCase()); // Simple loose matching for subject if strictly filtered
        return examMatch && yearMatch && subjectMatch;
    });

    // If we have enough local questions, return them to save API tokens and be fast
    if (localQuestions.length >= 3) {
        return localQuestions;
    }

    // 2. Fallback to AI Generation if local data is insufficient
    const prompt = `
      Retrieve 5 memory-based Previous Year Questions (PYQ) for the "${exam}" exam specifically for the subject "${subject}" from the year ${year || "recent years (2020-2023)"}.
      
      CONTEXT: These must be specifically relevant to Odisha Government Exams or the selected Central Exam.
      If exact word-for-word PYQs are not available in your training data, generate high-fidelity practice questions that mimic the exact pattern, difficulty, and topics of that year's paper.
      
      IMPORTANT: Format them as Multiple Choice Questions with 4 plausible options.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              exam: { type: Type.STRING },
              year: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING, description: "The correct option text exactly as it appears in options" },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "answer", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      const aiQuestions = JSON.parse(response.text) as PYQItem[];
      // Combine local and AI questions, prioritizing local
      return [...localQuestions, ...aiQuestions];
    }
    
    return localQuestions;
  } catch (error) {
    console.error("Error fetching PYQs:", error);
    return [];
  }
};

/**
 * Simulates fetching high-priority notifications
 */
export const fetchNotifications = async (): Promise<NotificationItem[]> => {
    try {
        const prompt = `
            Identify 3 critical alerts for an Odisha government exam aspirant right now.
            Include 1 upcoming deadline (check OSSC/UPSC dates if known), 1 important news event, and 1 general tip.
            Strict JSON output.
        `;
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['JOB', 'NEWS', 'ALERT'] },
                            message: { type: Type.STRING },
                            timestamp: { type: Type.STRING },
                        }
                    }
                }
            }
        });
        if (response.text) {
            return JSON.parse(response.text) as NotificationItem[];
        }
        return [];
    } catch (e) {
        return [];
    }
}

/**
 * Study Partner Chat
 */
export const createChatSession = () => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are an expert exam preparation tutor specializing in Odisha Government Exams (OPSC, OSSSC), OSSC, UPSC, and Banking (IBPS). Help the student with concepts, formulas, and general knowledge.",
        }
    });
};
