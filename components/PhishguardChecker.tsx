
import React, { useState, useRef, ChangeEvent } from 'react';
import { AnalysisResult, AnalysisStatus, Language } from '../types';
import { UI_TEXT } from '../constants';
import { analyzeEmail } from '../services/geminiService';
import { PhishguardLogo } from './icons/PhishguardLogo';
import { UploadIcon } from './icons/UploadIcon';
import LanguageSwitcher from './LanguageSwitcher';

interface PhishguardCheckerProps {
    onLogout: () => void;
}

const ResultCard: React.FC<{ result: AnalysisResult; lang: Language }> = ({ result, lang }) => {
    const text = UI_TEXT[lang];
    const statusConfig = {
        [AnalysisStatus.SAFE]: {
            label: text.safe,
            icon: '✅',
            colorClasses: 'bg-green-50 border-green-500 text-green-800',
        },
        [AnalysisStatus.SUSPICIOUS]: {
            label: text.suspicious,
            icon: '⚠️',
            colorClasses: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        },
        [AnalysisStatus.PHISHING]: {
            label: text.phishing,
            icon: '🚨',
            colorClasses: 'bg-red-50 border-red-500 text-red-800',
        },
    };

    const config = statusConfig[result.status];

    return (
        <div className={`mt-6 p-6 rounded-2xl border-2 shadow-md transition-all duration-300 ${config.colorClasses}`}>
            <h3 className="text-xl font-bold flex items-center">{config.icon} {config.label}</h3>
            <p className="mt-2 text-md">{result.explanation}</p>
        </div>
    );
};

const PhishguardChecker: React.FC<PhishguardCheckerProps> = ({ onLogout }) => {
    const [language, setLanguage] = useState<Language>('EN');
    const [emailContent, setEmailContent] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const text = UI_TEXT[language];

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setEmailContent(content);
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyze = async () => {
        if (!emailContent.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeEmail(emailContent);
            setAnalysisResult(result);
        } catch (err) {
            setError(text.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <PhishguardLogo className="h-10 w-10 text-blue-600" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{text.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher selectedLanguage={language} onSelectLanguage={setLanguage} />
                    <button onClick={onLogout} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        {text.logout}
                    </button>
                </div>
            </header>
            
            <main className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">{text.checkerTitle}</h2>
                    <p className="mt-2 text-slate-500 max-w-2xl mx-auto">{text.checkerSubtitle}</p>
                </div>

                <div className="mt-8">
                    <textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder={text.pastePlaceholder}
                        className="w-full h-48 p-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-inner"
                        disabled={isLoading}
                    />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".eml,.txt"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                    >
                        <UploadIcon className="w-5 h-5" />
                        {text.uploadFile}
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !emailContent.trim()}
                        className="w-full sm:w-auto px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-blue-300 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isLoading ? text.analyzing : text.analyze}
                    </button>
                </div>

                {isLoading && (
                     <div className="mt-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-slate-500 mt-2">{text.analyzing}</p>
                    </div>
                )}
                
                {error && <p className="mt-6 text-center text-red-600">{error}</p>}
                
                {analysisResult && <ResultCard result={analysisResult} lang={language} />}

                <div className="mt-8 text-center text-xs text-slate-400">
                    <p>{text.poweredBy}</p>
                </div>
            </main>
        </div>
    );
};

export default PhishguardChecker;
