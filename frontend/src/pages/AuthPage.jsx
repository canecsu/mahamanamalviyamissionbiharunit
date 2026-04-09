import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { Mail, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      let user;
      if (isLogin) {
        user = await login(formData.email, formData.password);
      } else {
        // Capture the auto-logged-in user after registration
        user = await register(formData.name, formData.email, formData.password);
      }

      // Route admins to a special dashboard if needed
      if (user && user.role === 'admin') {
        navigate('/admin', { replace: true }); 
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStatus({ loading: false, error: null });
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-[70px]">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-8 h-8 text-[#F4C430]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#111111]">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={toggleMode}
            className="font-medium text-[#F4C430] hover:text-[#d4aa20] transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sm:rounded-3xl sm:px-10">
          
          {status.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{status.error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-[#111111] focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430] outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-[#111111] focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430] outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-[#111111] focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430] outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={status.loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-[#111111] hover:bg-[#F4C430] hover:text-[#111111] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111111] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {status.loading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
