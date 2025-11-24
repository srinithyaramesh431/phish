
import React, { useState } from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
    selectedLanguage: Language;
    onSelectLanguage: (language: Language) => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ selectedLanguage, onSelectLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = languages.find(l => l.code === selectedLanguage) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
                <span>{selected.flag}</span>
                <span className="text-sm font-medium text-slate-700">{selected.code}</span>
                 <svg className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-slate-200 z-10">
                    <ul className="py-1">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => {
                                        onSelectLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
