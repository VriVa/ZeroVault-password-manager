import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Eye, EyeOff, Shield, Mail, CheckCircle, Sun, Moon, ArrowLeft, User } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.length >= 12) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^a-zA-Z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!agreedToTerms) {
      alert('Please accept terms and conditions');
      return;
    }
    
    // Mock success
    alert('Account created successfully!');
    navigate('/login');
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return darkMode ? 'bg-red-500' : 'bg-red-500';
    if (passwordStrength <= 4) return darkMode ? 'bg-yellow-500' : 'bg-yellow-500';
    return darkMode ? 'bg-green-500' : 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-black' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
    }`}>
      
      {/* Background Blur Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {darkMode ? (
          <>
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          </>
        ) : (
          <>
            <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-20"></div>
          </>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 p-2 rounded-lg transition z-50 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Back to Home */}
      <button
        onClick={() => navigate('/')}
        className={`fixed top-6 left-6 p-2 rounded-lg transition z-50 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className={`rounded-2xl shadow-2xl p-8 transition-colors ${
          darkMode 
            ? 'bg-gray-800 border border-blue-500 border-opacity-20' 
            : 'bg-white'
        }`}>
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-green-600'
            }`}>
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create Your Account
          </h2>
          <p className={`text-center mb-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Join ZeroVault - Your passwords, truly secure
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all outline-none ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500' 
                      : 'border border-gray-200 focus:ring-2 focus:ring-green-500'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all outline-none ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500' 
                      : 'border border-gray-200 focus:ring-2 focus:ring-green-500'
                  }`}
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Master Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className={`w-full pl-11 pr-11 py-3 rounded-xl transition-all outline-none ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500' 
                      : 'border border-gray-200 focus:ring-2 focus:ring-green-500'
                  }`}
                  placeholder="Enter master password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3.5 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i < passwordStrength ? getStrengthColor() : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength <= 2 ? 'text-red-500' :
                    passwordStrength <= 4 ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    Password strength: {getStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <Key className={`absolute left-3 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full pl-11 pr-11 py-3 rounded-xl transition-all outline-none ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500' 
                      : 'border border-gray-200 focus:ring-2 focus:ring-green-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-3.5 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className={`rounded-xl p-4 text-sm flex items-start gap-2 ${
              darkMode 
                ? 'bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-blue-300' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>
                Your password is never stored or sent to our servers. All encryption happens locally on your device.
              </span>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className={`mt-1 w-4 h-4 rounded border-gray-300 focus:ring-2 ${
                  darkMode ? 'text-blue-600 focus:ring-blue-500' : 'text-green-600 focus:ring-green-500'
                }`}
              />
              <label htmlFor="terms" className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                I agree to the{' '}
                <button type="button" className={`font-semibold hover:underline ${darkMode ? 'text-blue-400' : 'text-green-600'}`}>
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" className={`font-semibold hover:underline ${darkMode ? 'text-blue-400' : 'text-green-600'}`}>
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className={`text-sm font-semibold transition-colors ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-green-600 hover:text-green-700'
              }`}
            >
              Already have an account? <span className="underline">Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
