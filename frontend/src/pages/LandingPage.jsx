import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, Zap, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg border-b border-blue-500 border-opacity-20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ZeroVault
              </h1>
              <p className="text-xs text-blue-300 hidden sm:block">Your Privacy, Our Proof</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-gray-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-400 transition">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-400 transition">How It Works</button>
            <button onClick={() => scrollToSection('security')} className="hover:text-blue-400 transition">Security</button>
            <button onClick={() => scrollToSection('trust')} className="hover:text-blue-400 transition">Why Trust Us</button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-3">
            <button onClick={() => navigate('/register')} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold">
              Register
            </button>
            <button onClick={() => navigate('/login')} className="px-6 py-2 border-2 border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500 hover:bg-opacity-10 transition font-semibold">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 bg-opacity-90 backdrop-blur-md border-t border-blue-500 border-opacity-20">
            <nav className="flex flex-col gap-4 p-6">
              <button onClick={() => scrollToSection('features')} className="text-left hover:text-blue-400 transition">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left hover:text-blue-400 transition">How It Works</button>
              <button onClick={() => scrollToSection('security')} className="text-left hover:text-blue-400 transition">Security</button>
              <button onClick={() => scrollToSection('trust')} className="text-left hover:text-blue-400 transition">Why Trust Us</button>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mt-2">
                Launch App
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-20 pb-16 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500 border-opacity-30">
              🔐 Zero-Knowledge Authentication
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Your Passwords,
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Never Exposed
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            We prove you're you without ever seeing your password. Military-grade encryption keeps your vault locked on your device. Complete control. Complete privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-lg font-semibold shadow-lg flex items-center justify-center gap-2">
              Start Protecting Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-lg hover:bg-purple-500 hover:bg-opacity-10 transition text-lg font-semibold">
              Watch Demo
            </button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-20 rounded-lg p-6 hover:border-opacity-50 transition">
              <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-300 mb-2">256-bit</div>
              <div className="text-gray-400 text-sm">Military-Grade Encryption</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-500 border-opacity-20 rounded-lg p-6 hover:border-opacity-50 transition">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-300 mb-2">Zero</div>
              <div className="text-gray-400 text-sm">Password Exposure</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-pink-500 border-opacity-20 rounded-lg p-6 hover:border-opacity-50 transition">
              <Shield className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-pink-300 mb-2">Verified</div>
              <div className="text-gray-400 text-sm">Proof-Based Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Powerful Features,<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Simple to Use
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Advanced security that works invisibly in the background
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Password-Free Login</h3>
              <p className="text-gray-400 leading-relaxed">
                No more remembering complex passwords. We use advanced proof technology to verify who you are without ever asking for your password.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">End-to-End Encrypted</h3>
              <p className="text-gray-400 leading-relaxed">
                Your vault is encrypted on your device with military-grade encryption. Even we can't see your passwords. Decryption happens only on your device.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-pink-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition">
                <EyeOff className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Your Device, Your Data</h3>
              <p className="text-gray-400 leading-relaxed">
                All encryption happens locally on your device. Your vault stays on your computer. We only store the locked box, never the key.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-cyan-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition">
                <CheckCircle className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Audit Trail</h3>
              <p className="text-gray-400 leading-relaxed">
                Every login is recorded. See who accessed your account and when. Complete transparency with immutable records for peace of mind.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Encryption and authentication happen in milliseconds. Instant login, instant access. Security shouldn't slow you down.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Auto-Fill Passwords</h3>
              <p className="text-gray-400 leading-relaxed">
                Securely store and automatically fill your passwords. One-click login to any website. Security without the hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Simple, elegant, and secure from start to finish
            </p>
          </div>

          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-2xl text-white shadow-lg">
                1
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-20 rounded-lg p-6 flex-1 hover:border-opacity-50 transition">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">Create Your Account</h3>
                <p className="text-gray-400">
                  Choose a master password. We convert it into a cryptographic key using advanced algorithms. This key is used to prove your identity.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-2xl text-white shadow-lg">
                2
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-500 border-opacity-20 rounded-lg p-6 flex-1 hover:border-opacity-50 transition">
                <h3 className="text-2xl font-bold text-purple-300 mb-2">Store Your Passwords Securely</h3>
                <p className="text-gray-400">
                  Add your existing passwords to your vault. Everything is encrypted locally on your device using the strongest encryption available. Nothing ever leaves unencrypted.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-2xl text-white shadow-lg">
                3
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-pink-500 border-opacity-20 rounded-lg p-6 flex-1 hover:border-opacity-50 transition">
                <h3 className="text-2xl font-bold text-pink-300 mb-2">Login with Proof</h3>
                <p className="text-gray-400">
                  When you log in, we send you a challenge. Your device generates a mathematical proof that you know the password without revealing it. It's like showing your driver's license without showing your full address.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-2xl text-white shadow-lg">
                4
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-cyan-500 border-opacity-20 rounded-lg p-6 flex-1 hover:border-opacity-50 transition">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">Access Your Vault</h3>
                <p className="text-gray-400">
                  Once verified, your encrypted vault is unlocked on your device. Your passwords are decrypted only on your device, and you get instant access to all your saved passwords and accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Security You Can Trust
            </h2>
            <p className="text-gray-400 text-lg">
              Built on proven cryptographic standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Security Point 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition">
              <h3 className="text-2xl font-bold text-blue-300 mb-4">Proof-Based Authentication</h3>
              <p className="text-gray-400 mb-4">
                We use Schnorr protocol, a mathematically proven authentication method. When you log in, we verify a proof that only someone with your password could generate.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-400" /> Your password never transmitted</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-400" /> Challenge-response verification</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-400" /> Proven cryptographic security</li>
              </ul>
            </div>

            {/* Security Point 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition">
              <h3 className="text-2xl font-bold text-purple-300 mb-4">AES-256 Encryption</h3>
              <p className="text-gray-400 mb-4">
                Your vault is protected with AES-256-GCM, the same encryption standard used by governments and banks worldwide.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Military-grade encryption</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Local client-side encryption</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Authenticated encryption (GCM mode)</li>
              </ul>
            </div>

            {/* Security Point 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition">
              <h3 className="text-2xl font-bold text-pink-300 mb-4">Client-Side Processing</h3>
              <p className="text-gray-400 mb-4">
                All encryption, decryption, and proof generation happens on your device. We never see unencrypted data.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> Zero server-side decryption</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> Keys never leave your device</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> Your data stays private</li>
              </ul>
            </div>

            {/* Security Point 4 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500 border-opacity-20 rounded-xl p-8 hover:border-opacity-50 transition">
              <h3 className="text-2xl font-bold text-cyan-300 mb-4">Immutable Audit Logs</h3>
              <p className="text-gray-400 mb-4">
                Every login is recorded with a timestamp. These records are cryptographically protected to prevent tampering.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Complete access history</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Tamper-proof records</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Transparent accountability</li>
              </ul>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Performance You'll Love</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">120ms</div>
                <div className="text-gray-400 text-sm">Password Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">2ms</div>
                <div className="text-gray-400 text-sm">Proof Generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400 mb-2">1.5ms</div>
                <div className="text-gray-400 text-sm">Verification</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">&lt;1ms</div>
                <div className="text-gray-400 text-sm">Vault Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section id="trust" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Why You Can Trust ZeroVault
            </h2>
            <p className="text-gray-400 text-lg">
              We're built on principles of transparency and security
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500 border-opacity-20 rounded-xl p-8">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Open Source</h3>
              <p className="text-gray-400">
                Our code is available for anyone to audit. No hidden logic, no backdoors. Full transparency on how your security works.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500 border-opacity-20 rounded-xl p-8">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Independently Audited</h3>
              <p className="text-gray-400">
                Our cryptographic implementation is verified by security experts. We stand behind the strength of our algorithms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500 border-opacity-20 rounded-xl p-8">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">No Passwords Ever Stored</h3>
              <p className="text-gray-400">
                We don't store your master password. We can't recover it. We prove you own it without ever knowing it.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500 border-opacity-20 rounded-xl p-8">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Privacy First</h3>
              <p className="text-gray-400">
                Your data belongs to you. We never sell information, and we never use it for any purpose other than serving you.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-blue-500 border-opacity-20">
                    <th className="text-left p-4 text-white font-bold">Feature</th>
                    <th className="text-center p-4 text-blue-300 font-bold">ZeroVault</th>
                    <th className="text-center p-4 text-gray-400 font-bold">Traditional Managers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-500 border-opacity-10 hover:bg-blue-500 hover:bg-opacity-5 transition">
                    <td className="p-4 text-gray-300">Password Ever Stored</td>
                    <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-blue-500 border-opacity-10 hover:bg-blue-500 hover:bg-opacity-5 transition">
                    <td className="p-4 text-gray-300">Client-Side Encryption</td>
                    <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-blue-500 border-opacity-10 hover:bg-blue-500 hover:bg-opacity-5 transition">
                    <td className="p-4 text-gray-300">Zero-Knowledge Proof</td>
                    <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-blue-500 border-opacity-10 hover:bg-blue-500 hover:bg-opacity-5 transition">
                    <td className="p-4 text-gray-300">Immutable Audit Trail</td>
                    <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-blue-500 hover:bg-opacity-5 transition">
                    <td className="p-4 text-gray-300">Open Source</td>
                    <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Reclaim Your Privacy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join users who are taking control of their digital security. Start protecting your passwords today—no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-lg font-semibold shadow-lg flex items-center justify-center gap-2">
              Launch ZeroVault
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 border-2 border-blue-400 text-blue-300 rounded-lg hover:bg-blue-500 hover:bg-opacity-10 transition text-lg font-semibold">
              Read the Whitepaper
            </button>
          </div>

          {/* Newsletter */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-20 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get notified about new features, security updates, and best practices for password management.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 bg-opacity-50 border border-blue-500 border-opacity-20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-opacity-50 transition"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-blue-500 border-opacity-20 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white">ZeroVault</span>
              </div>
              <p className="text-gray-400 text-sm">
                Zero-knowledge password manager. Your privacy, our proof.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Security</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Download</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Developers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">API</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Security</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-500 border-opacity-20 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © 2025 ZeroVault. Built with security and privacy first. No passwords stored. Ever.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}