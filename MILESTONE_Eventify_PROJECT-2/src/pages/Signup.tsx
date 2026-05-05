import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';

export default function Signup() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        toast.success('Account created successfully!', { duration: 2000 });
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Signup failed');
      }
    } catch (error) {
      toast.error('An error occurred during signup');
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-md shadow-sm p-10 mt-12 mb-12">
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stone-200 text-stone-700 mb-6">
          <UserPlus size={24} />
        </div>
        <h2 className="text-[32px] font-serif text-stone-900 mb-2">Create Account</h2>
        <p className="text-stone-500 text-[15px]">Join Eventify to manage your registrations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-[0.15em] block">Full Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            className="w-full bg-[#f8f9fa] border-none rounded-none border-b-2 border-stone-200 px-4 py-3.5 outline-none transition-all font-medium text-[15px] focus:border-editorial-accent focus:bg-white" 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-[0.15em] block">Email Address</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            className="w-full bg-[#f8f9fa] border-none rounded-none border-b-2 border-stone-200 px-4 py-3.5 outline-none transition-all font-medium text-[15px] focus:border-editorial-accent focus:bg-white" 
            required
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-[0.15em] block">Password</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            className="w-full bg-[#f8f9fa] border-none rounded-none border-b-2 border-stone-200 px-4 py-3.5 outline-none transition-all font-medium text-[15px] focus:border-editorial-accent focus:bg-white pr-12" 
            required
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 bottom-3.5 text-stone-400 hover:text-stone-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full bg-[#1e2e22] text-white font-bold py-4 px-8 rounded-xl hover:bg-black transition-colors duration-300 text-[13px] tracking-widest flex items-center justify-center gap-2 group uppercase">
            Create Account
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      <div className="mt-12 text-center pt-6">
        <p className="text-[13px] text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-stone-800 hover:text-black uppercase tracking-wide ml-1">Log In</Link>
        </p>
      </div>
    </div>
  );
}
