import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MetaTags from '../components/MetaTags';

const AdminLogin = () => {
  const { login, isAuthenticated, error: authError, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF8F5] px-6 select-none animate-fade-in">
      <MetaTags title="Admin Login" description="Administrative access panel login screen." />

      <div className="bg-white border border-[#EADFC9]/45 rounded-none shadow-sm max-w-md w-full p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#7C5F43] rounded-none flex items-center justify-center text-[#E3D8C4] font-serif font-black text-xl mx-auto mb-3.5">
            TW
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2A211D] mb-1">Admin Dashboard Portal</h2>
          <p className="text-xs text-[#8E7D75]">Enter administrative credentials to manage catalog items</p>
        </div>

        {(localError || authError) && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-none border border-red-200 mb-5 font-semibold text-center select-none">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col">
            <label htmlFor="login-email" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Admin Email Address</label>
            <input 
              id="login-email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75] font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="login-password" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Security Password</label>
            <input 
              id="login-password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75]"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold text-xs py-3.5 rounded-none tracking-wider uppercase mt-4 transition-colors duration-200 focus:outline-none"
          >
            {loading ? 'Verifying Session...' : 'Authenticate Access'}
          </button>

        </form>

        <div className="mt-8 text-center text-[10px] text-[#8E7D75] select-none border-t border-[#EADFC9]/30 pt-4">
          <span className="block font-semibold">Protected Administration Session</span>
          <span className="block mt-0.5">Authorization tokens remain active for 30 days. Do not share admin credentials.</span>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
