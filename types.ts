
export enum AnalysisStatus {
    SAFE = 'SAFE',
    SUSPICIOUS = 'SUSPICIOUS',
    PHISHING = 'PHISHING',
}

export interface AnalysisResult {
    status: AnalysisStatus;
    explanation: string;
}

export type Language = 'EN' | 'ES' | 'FR';
