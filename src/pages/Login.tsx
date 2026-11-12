import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import SEO from '../components/SEO';
import logo from '../assets/logoBase64';

export default function Login() {
  const { signInWithGoogle, user, isAdmin, studentProfile, loading, signOut, signUpWithEmail, signInWithEmail, sendResetEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  React.useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        if (!studentProfile) {
           setError('This email is not registered with DEI BOYS HOSTEL. Please contact the hostel office.');
           setIsAuthenticating(false);
           signOut();
        } else if (studentProfile.accountStatus === 'Inactive') {
           setError('Your hostel account is inactive. Please contact the hostel office.');
           setIsAuthenticating(false);
           signOut();
        } else {
           const destination = location.state?.from?.pathname || '/dashboard';
           navigate(destination, { replace: true });
        }
      }
    }
  }, [user, isAdmin, studentProfile, loading, navigate, location, signOut]);

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setError('');
    setInfoMessage('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setInfoMessage('');
      setIsAuthenticating(true);
      await signInWithGoogle();
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsAuthenticating(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (mode !== 'forgot' && !password) {
      setError('Please enter your password');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsAuthenticating(true);

      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else if (mode === 'signup') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsAuthenticating(false);
          return;
        }
        await signUpWithEmail(email, password, fullName.trim());
      } else if (mode === 'forgot') {
        await sendResetEmail(email);
        setInfoMessage('Password reset link sent! Please check your inbox.');
        setIsAuthenticating(false);
      }
    } catch (err: any) {
      console.error(err);
      setIsAuthenticating(false);
      if (mode === 'login') {
        setError('Invalid email or password');
      } else if (mode === 'signup') {
        if (err.code === 'auth/email-already-in-use') {
          setError('This email is already registered. Please Sign In.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters.');
        } else {
          setError(err.message || 'Failed to create account.');
        }
      } else if (mode === 'forgot') {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          setError('No user found with this email address.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else {
          setError(err.message || 'Failed to send reset email.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-hostel-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hostel-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-hostel-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO 
        title="Student & Admin Login | DEI Boys Hostel Agra"
        description="Secure login portal for DEI Boys Hostel students and administration. Access your dashboard, manage profiles, and pay fees online."
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <div className="bg-white p-0 rounded-full shadow-md border border-gray-100 flex items-center justify-center w-20 h-20 overflow-hidden">
            <img 
              src={logo} 
              alt="DEI Logo" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-hostel-text">
          {mode === 'login' && 'Welcome back'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'forgot' && 'Reset Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {mode === 'login' && 'Sign in to access your portal'}
          {mode === 'signup' && 'Register to get started with your portal'}
          {mode === 'forgot' && 'Enter your email to receive a password reset link'}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Card className="px-4 py-8 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="mb-6 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-6">
            {mode === 'signup' && (
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                leftIcon={<User className="h-5 w-5" />}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Mail className="h-5 w-5" />}
              required
            />
            
            {mode !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                required
              />
            )}

            {mode === 'signup' && (
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-5 w-5" />}
                required
              />
            )}

            {mode === 'login' && (
              <div className="flex justify-end !mt-1">
                <button 
                  type="button" 
                  onClick={() => handleModeChange('forgot')}
                  className="text-sm text-hostel-accent hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isAuthenticating}
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Sign Up'}
              {mode === 'forgot' && 'Send Reset Link'}
            </Button>
            
            {mode !== 'forgot' && (
              <>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isAuthenticating}
                  leftIcon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  }
                >
                  Google
                </Button>
              </>
            )}

            <div className="text-center text-sm text-gray-500 mt-4">
              {mode === 'login' && (
                <p>
                  New to DEI Boys Hostel?{' '}
                  <button 
                    type="button" 
                    onClick={() => handleModeChange('signup')}
                    className="text-hostel-accent hover:underline font-bold"
                  >
                    Create Account
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => handleModeChange('login')}
                    className="text-hostel-accent hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <button 
                  type="button" 
                  onClick={() => handleModeChange('login')}
                  className="text-hostel-accent hover:underline font-bold"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
