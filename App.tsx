
import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import PhishguardChecker from './components/PhishguardChecker';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {isAuthenticated ? (
                <PhishguardChecker onLogout={handleLogout} />
            ) : (
                <AuthPage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;
