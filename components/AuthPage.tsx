
import React, { useState } from 'react';
import { PhishguardLogo } from './icons/PhishguardLogo';
import { EyeOpenIcon } from './icons/EyeOpenIcon';
import { EyeClosedIcon } from './icons/EyeClosedIcon';

interface AuthPageProps {
    onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would have API calls for login/signup
        // For this demo, any valid email and password will work
        if (email && password.length >= 6) {
            onLoginSuccess();
        } else {
            alert(isLogin ? "Invalid credentials" : "Please fill all fields correctly.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-300">
                <div className="flex flex-col items-center space-y-2">
                    <PhishguardLogo className="h-16 w-16 text-blue-600" />
                    <h1 className="text-3xl font-bold text-slate-800">Welcome to Phishguard</h1>
                    <p className="text-slate-500">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                            >
                                {showPassword ? <EyeClosedIcon className="h-5 w-5" /> : <EyeOpenIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:translate-y-[-2px]"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:text-blue-500">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
