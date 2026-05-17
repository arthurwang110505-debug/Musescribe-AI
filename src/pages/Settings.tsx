import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Bell, Key } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Studio Settings</h1>
        <p className="text-slate-400 text-sm">Manage your profile, preferences, and API connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Section */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center backdrop-blur-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] mb-6">
              <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">
              {user?.displayName || 'Studio Artist'}
            </h2>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-mono mb-6">
              <Mail size={12} />
              {user?.email}
            </div>
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-cyan-500/20">
              Pro Member
            </span>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Shield size={16} className="text-cyan-400" />
              Security & Access
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                  <div className="text-sm font-bold text-white mb-1">Password</div>
                  <div className="text-xs text-slate-500">Change your password to keep your account secure.</div>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-wider rounded-xl transition-colors border border-white/10">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Key size={14} className="text-indigo-400" />
                    Custom API Keys
                  </div>
                  <div className="text-xs text-slate-500">Provide your own Hugging Face or Gemini API keys.</div>
                </div>
                <button className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-xs font-bold text-indigo-300 uppercase tracking-wider rounded-xl transition-colors border border-indigo-500/30">
                  Configure
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Bell size={16} className="text-cyan-400" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              {[
                { title: 'Transcription Complete', desc: 'Get notified when large files finish processing.' },
                { title: 'Product Updates', desc: 'News about new models and features.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                  <div className="w-10 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
