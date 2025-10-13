import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setStatus('');

    if (!username) {
      setStatus('Please enter your username');
      return;
    }

    if (!password) {
      setStatus('Please enter your password');
      return;
    }

    setStatus('Authenticating with ZKP...');
    setTimeout(() => {
      setStatus('Login successful!');
      setTimeout(() => {
        onLoginSuccess();
        navigate('/vault');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Access your secure password vault
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter your master password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 flex items-start gap-2">
              <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Zero-Knowledge Proof ensures your password never leaves your device</span>
            </div>

            {status && (
              <Alert className={status.includes('successful') ? 'bg-emerald-50 border-emerald-200' : status.includes('Authenticating') ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}>
                <AlertDescription className={status.includes('successful') ? 'text-emerald-800' : status.includes('Authenticating') ? 'text-blue-800' : 'text-red-800'}>
                  {status}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              Sign In Securely
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold transition-colors"
            >
              Don't have an account? <span className="underline">Create one</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
