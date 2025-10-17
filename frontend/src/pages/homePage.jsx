import React, { useState } from 'react';
import { Lock, Shield, Eye, Code, ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompactLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white min-h-screen" : "bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900 min-h-screen"}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${
        darkMode 
          ? 'bg-gray-900 bg-opacity-95 backdrop-blur-md border-b border-blue-500 border-opacity-20' 
          : 'bg-white bg-opacity-95 backdrop-blur-md shadow-lg border-b border-green-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-green-600'
            }`}>
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                darkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent'
              }`}>
                ZeroVault
              </h1>
              <p className={`text-xs hidden sm:block ${darkMode ? 'text-blue-300' : 'text-green-600'}`}>Your Privacy, Our Proof</p>
            </div>
          </div>

          <nav className={`hidden md:flex gap-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <a href="#tech" className={`transition ${darkMode ? 'hover:text-blue-400' : 'hover:text-green-600'}`}>Technology</a>
            <a href="#features" className={`transition ${darkMode ? 'hover:text-blue-400' : 'hover:text-green-600'}`}>Features</a>
          </nav>

          <div className="hidden md:flex gap-3 items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => navigate('/register')}
              className={`px-6 py-2 text-white rounded-lg transition font-semibold ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md'
            }`}>
              Register
            </button>
            <button 
              onClick={() => navigate('/login')}
              className={`px-6 py-2 rounded-lg transition font-semibold ${
              darkMode 
                ? 'border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:bg-opacity-10' 
                : 'border-2 border-green-500 text-green-600 hover:bg-green-50'
            }`}>
              Login
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className={darkMode ? "md:hidden bg-gray-800 bg-opacity-90 backdrop-blur-md border-t border-blue-500 border-opacity-20" : "md:hidden bg-white border-t border-green-200 shadow-lg"}>
            <nav className="flex flex-col gap-4 p-6">
              <a href="#tech" onClick={() => setIsMenuOpen(false)} className={`text-left transition ${darkMode ? 'hover:text-blue-400' : 'hover:text-green-600 text-gray-700'}`}>Technology</a>
              <a href="#features" onClick={() => setIsMenuOpen(false)} className={`text-left transition ${darkMode ? 'hover:text-blue-400' : 'hover:text-green-600 text-gray-700'}`}>Features</a>
              
              <button
                onClick={toggleDarkMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/register');
                }}
                className={`w-full px-6 py-2 text-white rounded-lg mt-2 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 shadow-md'
              }`}>
                Get Started
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
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

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border inline-block mb-6 ${
            darkMode 
              ? 'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500 border-opacity-30' 
              : 'bg-green-100 text-green-700 border-green-300'
          }`}>
            🔐 Zero-Knowledge Password Manager
          </span>

          <h1 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${darkMode ? '' : 'text-gray-900'}`}>
            Secure Passwords with
            <span className={`block bg-clip-text text-transparent ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                : 'bg-gradient-to-r from-green-600 to-green-700'
            }`}>
              Zero-Knowledge Proof
            </span>
          </h1>

          <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Built on Schnorr Protocol and AES-256 encryption. Your master password never leaves your device—we prove you know it without ever seeing it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => navigate('/register')}
              className={`px-8 py-4 text-white rounded-lg transition text-lg font-semibold shadow-lg flex items-center justify-center gap-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            }`}>
              Start Protecting Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className={`px-8 py-4 border-2 rounded-lg transition text-lg font-semibold ${
              darkMode 
                ? 'border-purple-500 text-purple-300 hover:bg-purple-500 hover:bg-opacity-10' 
                : 'border-green-500 text-green-600 hover:bg-green-50'
            }`}>
              Login
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className={`rounded-lg p-4 transition ${
              darkMode 
                ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-20' 
                : 'bg-white border border-green-200 shadow-md'
            }`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-green-600'}`}>256-bit</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AES-GCM</div>
            </div>
            <div className={`rounded-lg p-4 transition ${
              darkMode 
                ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-500 border-opacity-20' 
                : 'bg-white border border-green-200 shadow-md'
            }`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-green-600'}`}>Zero</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Exposure</div>
            </div>
            <div className={`rounded-lg p-4 transition ${
              darkMode 
                ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-pink-500 border-opacity-20' 
                : 'bg-white border border-green-200 shadow-md'
            }`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-pink-400' : 'text-green-600'}`}>100%</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Client-Side</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tech" className={`py-20 px-6 ${darkMode ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? '' : 'text-gray-900'}`}>
              Built on Proven Cryptography
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Industry-standard protocols for maximum security
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`group rounded-xl p-6 transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition ${
                darkMode 
                  ? 'bg-blue-500 bg-opacity-20 group-hover:bg-opacity-40' 
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <Shield className={`w-7 h-7 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-green-700'}`}>Schnorr Protocol</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Zero-knowledge proof system that authenticates you without transmitting your password. Mathematically proven secure.
              </p>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>Challenge → Proof → Verification</code>
              </div>
            </div>

            <div className={`group rounded-xl p-6 transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition ${
                darkMode 
                  ? 'bg-purple-500 bg-opacity-20 group-hover:bg-opacity-40' 
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <Lock className={`w-7 h-7 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-purple-300' : 'text-green-700'}`}>AES-256-GCM</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Military-grade encryption for your vault. All encryption happens client-side on your device before any data transmission.
              </p>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>256-bit key + Authenticated encryption</code>
              </div>
            </div>

            <div className={`group rounded-xl p-6 transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition ${
                darkMode 
                  ? 'bg-pink-500 bg-opacity-20 group-hover:bg-opacity-40' 
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <Eye className={`w-7 h-7 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-pink-300' : 'text-green-700'}`}>Client-Side Only</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your master password and decryption keys never leave your browser. The server only stores encrypted vaults.
              </p>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>Local encryption + Zero server knowledge</code>
              </div>
            </div>

            <div className={`group rounded-xl p-6 transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition ${
                darkMode 
                  ? 'bg-cyan-500 bg-opacity-20 group-hover:bg-opacity-40' 
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <Code className={`w-7 h-7 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-300' : 'text-green-700'}`}>Web Crypto API</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Browser-native cryptographic operations. Uses secure, hardware-accelerated crypto functions built into modern browsers.
              </p>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>SubtleCrypto + PBKDF2 key derivation</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-6 ${darkMode ? '' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? '' : 'text-gray-900'}`}>
              Core Features
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need for secure password management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className={`rounded-xl p-6 text-center transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <Lock className={`w-10 h-10 mx-auto mb-3 ${darkMode ? 'text-blue-400' : 'text-green-600'}`} />
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Password-Free Login</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prove identity with cryptographic proofs, not passwords</p>
            </div>

            <div className={`rounded-xl p-6 text-center transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <Shield className={`w-10 h-10 mx-auto mb-3 ${darkMode ? 'text-purple-400' : 'text-green-600'}`} />
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Encrypted Vault</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Store unlimited passwords with AES-256 encryption</p>
            </div>

            <div className={`rounded-xl p-6 text-center transition duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500 border-opacity-20 hover:border-opacity-50' 
                : 'bg-white border border-green-200 hover:shadow-lg'
            }`}>
              <Eye className={`w-10 h-10 mx-auto mb-3 ${darkMode ? 'text-pink-400' : 'text-green-600'}`} />
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Audit Trail</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Immutable login history with timestamps</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-6 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? '' : 'text-gray-900'}`}>
            Start Securing Your Passwords
          </h2>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience true zero-knowledge security. Your passwords never leave your device.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className={`px-10 py-4 text-white rounded-lg transition text-lg font-semibold inline-flex items-center gap-2 shadow-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          }`}>
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-6 ${
        darkMode 
          ? 'bg-gray-900 border-t border-blue-500 border-opacity-20' 
          : 'bg-white border-t border-green-200'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 ZeroVault. Built with Schnorr Protocol & AES-256-GCM. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}