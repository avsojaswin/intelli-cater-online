import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input'; 

// Basic Input component defined locally for speed, ideally moved to ui/Input.tsx
const InputField = ({ label, type = "text", placeholder }: { label: string, type?: string, placeholder?: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input 
      type={type} 
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/50 focus:border-cta transition-shadow"
      placeholder={placeholder}
    />
  </div>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl text-white font-bold text-2xl mb-4">
            I
          </div>
          <h1 className="text-2xl font-bold text-primary">Sign in to Intelli-Cater</h1>
          <p className="text-slate-500 mt-2">Access your resource orchestration engine</p>
        </div>

        <Card className="shadow-lg">
          <form onSubmit={handleLogin}>
            <InputField label="Work Email" type="email" placeholder="chef@intellicater.com" />
            <InputField label="Password" type="password" placeholder="••••••••" />
            
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-cta border-gray-300 rounded focus:ring-cta" />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-cta hover:text-blue-700 font-medium">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <Button variant="secondary" fullWidth className="gap-2 relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with SSO
            </Button>
          </div>
        </Card>
        
        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account? <a href="#" className="text-cta font-medium">Contact Sales</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;