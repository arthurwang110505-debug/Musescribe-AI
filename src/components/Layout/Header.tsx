import { Music, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="flex items-center justify-between mb-8 px-2 no-print">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
          <Music className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">
          MuseScribe <span className="text-cyan-400 font-light italic">AI</span>
        </span>
      </Link>
      <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
        <Link to="/" className={`${isActive('/') ? 'text-cyan-400 border-b border-cyan-400' : 'hover:text-white'} pb-1 transition-all`}>Home</Link>
        <Link to="/library" className={`${isActive('/library') ? 'text-cyan-400 border-b border-cyan-400' : 'hover:text-white'} pb-1 transition-all`}>Library</Link>
        <Link to="/pricing" className={`${isActive('/pricing') ? 'text-cyan-400 border-b border-cyan-400' : 'hover:text-white'} pb-1 transition-all`}>Pricing</Link>
        <Link to="/blog" className={`${isActive('/blog') ? 'text-cyan-400 border-b border-cyan-400' : 'hover:text-white'} pb-1 transition-all`}>Blog</Link>
        
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
    </header>
  );
}
