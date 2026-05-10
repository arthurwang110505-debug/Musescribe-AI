import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col gap-8 no-print">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Product</span>
          <Link to="/studio" className="text-[10px] text-slate-500 hover:text-white transition-colors">Studio</Link>
          <Link to="/pricing" className="text-[10px] text-slate-500 hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Resources</span>
          <Link to="/docs" className="text-[10px] text-slate-500 hover:text-white transition-colors">Documentation</Link>
          <Link to="/blog" className="text-[10px] text-slate-500 hover:text-white transition-colors">Blog</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Legal</span>
          <Link to="/terms" className="text-[10px] text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-[10px] text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Company</span>
          <a href="#" className="text-[10px] text-slate-500 hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-[10px] text-slate-500 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="py-8 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em] border-t border-white/5">
        <span>&copy; {new Date().getFullYear()} MUSE SCRIBE LABORATORIES</span>
        <span className="hidden md:block">ENCRYPTED DATA FLOW // VERSION 3.2.0-PRO</span>
      </div>
    </footer>
  );
}
