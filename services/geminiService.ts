import { AnalysisResult, AnalysisStatus } from '../types';

// High-risk keywords that strongly indicate a phishing attempt.
const phishingKeywords = [
    'verify your account', 'update your payment', 'password reset', 'security alert', 'urgent action required',
    'confirm your identity', 'account suspended', 'login attempt', 'winner', 'prize', 'claim your reward',
    'invoice due', 'shipping confirmation', 'unusual activity', 'de-activation', 'confidential information', 'ssn', 'social security'
];

// Keywords or patterns that are suspicious but not definitive.
const suspiciousKeywords = [
    'click here', 'unsubscribe', 'limited time offer', 'act now', 'dear valued customer', 'dear user'
];

/**
 * Simulates an email analysis using "Random Forest" and "Blacklist Algorithm" heuristics
 * without making an external API call. This provides a functional offline experience.
 * @param emailContent The full content of the email to analyze.
 * @returns A promise that resolves to an AnalysisResult.
 */
export const analyzeEmail = async (emailContent: string): Promise<AnalysisResult> => {
    // Simulate network delay to mimic an API call for a better UX.
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

    if (!emailContent || emailContent.trim() === '') {
        return {
            status: AnalysisStatus.SAFE,
            explanation: 'Email content is empty.'
        }
    }

    const lowerCaseContent = emailContent.toLowerCase();

    // --- "Blacklist Algorithm" Simulation ---
    // Check for high-risk phishing keywords. If one is found, classify immediately as PHISHING.
    for (const keyword of phishingKeywords) {
        if (lowerCaseContent.includes(keyword)) {
            return {
                status: AnalysisStatus.PHISHING,
                explanation: `High-risk phrase found: "${keyword}". This is a common tactic used in phishing emails.`,
            };
        }
    }
    
    // --- "Random Forest" Simulation (feature checking & scoring) ---
    let suspiciousScore = 0;

    // Feature 1: Presence of suspicious keywords
    for (const keyword of suspiciousKeywords) {
        if (lowerCaseContent.includes(keyword)) {
            suspiciousScore += 1;
        }
    }
    
    // Feature 2: Number of links
    const linkCount = (lowerCaseContent.match(/<a href|http:|https:/g) || []).length;
    if (linkCount > 4) {
        suspiciousScore += 2; // Many links are highly suspicious
    } else if (linkCount > 1) {
        suspiciousScore += 1;
    }
    
    // Feature 3: Sense of urgency
    if (lowerCaseContent.includes('urgent') || lowerCaseContent.includes('immediately') || lowerCaseContent.includes('within 24 hours')) {
        suspiciousScore += 2;
    }
    
    // Feature 4: Generic greeting
    if (lowerCaseContent.match(/dear (user|customer|client|member|account holder)/)) {
        suspiciousScore += 1;
    }

    // Feature 5: Presence of disguised links (simple check)
    if (lowerCaseContent.includes('href') && !lowerCaseContent.includes('unsubscribe')) {
        const linkTextMatches = lowerCaseContent.match(/>([^<]+)<\/a>/g) || [];
        const hasNonUrlText = linkTextMatches.some(match => !match.includes('http'));
        if (hasNonUrlText) {
            suspiciousScore += 1;
        }
    }
    
    // --- Classification based on final score ---
    if (suspiciousScore >= 3) {
        return {
            status: AnalysisStatus.PHISHING,
            explanation: 'The email exhibits multiple characteristics of a phishing attempt, such as urgency and suspicious links.',
        };
    }

    if (suspiciousScore > 0) {
        return {
            status: AnalysisStatus.SUSPICIOUS,
            explanation: 'This email contains some suspicious elements. Please verify the sender and be cautious with any links.',
        };
    }

    // If no red flags are found, classify as SAFE
    return {
        status: AnalysisStatus.SAFE,
        explanation: 'No immediate signs of phishing were detected. As always, remain cautious when opening links or attachments.',
    };
};
