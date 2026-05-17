import { useState } from 'react';
import { Music, LogOut, User as UserIcon, Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    signOut(auth);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <header className="flex items-center justify-between mb-8 px-2 no-print relative z-50">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
          <Music className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">
          MuseScribe <span className="text-cyan-400 font-light italic">AI</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
        {menuItems.map(item => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`${isActive(item.path) ? 'text-cyan-400 border-b border-cyan-400' : 'hover:text-white'} pb-1 transition-all`}
          >
            {item.label}
          </Link>
        ))}

        {/* Studio CTA */}
        <Link
          to="/studio"
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.03] transition-all flex items-center gap-1.5"
        >
          Launch Studio <ChevronRight size={13} />
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} className="text-slate-400" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider hidden lg:block max-w-[100px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white text-xs font-bold uppercase tracking-wider">
            Login
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-slate-400 hover:text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-24 mx-6 p-8 bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl md:hidden flex flex-col gap-6"
          >
            {menuItems.map(item => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-bold uppercase tracking-widest ${isActive(item.path) ? 'text-cyan-400' : 'text-slate-400'}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-white/5 my-2" />
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={18} className="text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white uppercase truncate max-w-[150px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-red-500/10 text-red-400 rounded-xl"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-center text-white font-bold uppercase tracking-widest"
              >
                Login / Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

