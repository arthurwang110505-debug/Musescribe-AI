import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Music, 
  LayoutDashboard, 
  Library as LibraryIcon, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  Globe, 
  Activity,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Studio', path: '/studio' },
    { icon: Globe, label: 'Discover', path: '/discover' },
    { icon: LibraryIcon, label: 'My Library', path: '/library' },
    { icon: Activity, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
            <Music className="text-white" size={18} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight uppercase">
            MuseScribe <span className="text-cyan-400 font-light italic">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Main Menu</div>
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.path) 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <item.icon size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 rounded-xl mb-2">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={16} className="text-slate-400" />
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-white truncate">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest truncate">Pro Plan</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex bg-[#050508] text-slate-300 font-sans overflow-hidden relative">
      {/* Mobile Header */}
      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-[#050508]/80 backdrop-blur-md border-b border-white/10 z-30">
        <Link to="/" className="flex items-center gap-3">
          <Music className="text-cyan-400" size={20} />
          <span className="text-sm font-bold text-white uppercase tracking-tighter">MuseScribe</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Desktop Sidebar Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/10 flex-col bg-white/5 backdrop-blur-xl shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0a0a0f] border-r border-white/10 flex flex-col z-50 lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

