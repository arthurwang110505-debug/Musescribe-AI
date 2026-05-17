import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music, Zap, FileText, ChevronRight, Play,
  Mic, Globe, Star, ChevronDown, Check, Sparkles, Upload,
  Shield, Users, BarChart3, ArrowRight, Link as LinkIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

// ─── Typing Headline ───────────────────────────────────────
const TYPING_WORDS = ['Sheet Music', 'MIDI Files', 'Guitar Tabs', 'Lead Sheets'];

function TypingText() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const fullWord = TYPING_WORDS[index];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < fullWord.length) {
      timeout = setTimeout(() => setDisplayed(fullWord.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === fullWord.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, fullWord]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 inline-block min-w-[280px] md:min-w-[400px]">
      {displayed}
      <span className="animate-pulse text-cyan-400">|</span>
    </span>
  );
}

// ─── Animated Counter ──────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── FAQ Accordion ─────────────────────────────────────────
const FAQS = [
  { q: 'What audio formats does MuseScribe support?', a: 'We support MP3, WAV, M4A, OGG, FLAC, MP4, MOV, and WEBM. Files up to 50 MB can be uploaded directly, and you can also paste a YouTube, TikTok, or Instagram URL.' },
  { q: 'How accurate is the AI transcription?', a: 'MuseScribe uses two engines: our Standard engine (Basic Pitch by Spotify) delivers ~90% accuracy for single-instrument recordings, while MT3 Pro handles complex multi-instrument arrangements with state-of-the-art precision.' },
  { q: 'Do I need to create an account to try it?', a: 'No! You can transcribe audio and preview the score for free without signing up. An account is only required to save your work to the Library or export files.' },
  { q: 'Can I edit the transcribed sheet music?', a: 'Yes. The ABC notation editor lets you fine-tune every note, add chord symbols, change key signatures, and adjust tempo directly in the browser.' },
  { q: 'What can I export?', a: 'Free users can export ABC notation files. Pro users get PDF sheet music and MIDI export. MusicXML support is coming soon.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown size={18} className={`text-cyan-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hero Quick Upload ─────────────────────────────────────
// Files are handed off to Studio via sessionStorage (base64)
function HeroUploader() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem('hero_pending_file_name', file.name);
        sessionStorage.setItem('hero_pending_file_type', file.type);
        sessionStorage.setItem('hero_pending_file_data', reader.result as string);
      } catch {
        // sessionStorage full — just navigate without pre-loading
      }
      navigate('/studio');
    };
    reader.readAsDataURL(file);
  }, [navigate]);

  // @ts-expect-error - React 19 type mismatch with react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'], 'video/*': ['.mp4', '.mov', '.webm'] },
    multiple: false,
  });

  const handleUrlGo = () => {
    if (importUrl.trim()) navigate(`/studio?url=${encodeURIComponent(importUrl.trim())}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${isDragActive ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/15 hover:border-white/30 hover:bg-white/5'}`}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload size={22} className="text-cyan-400" />
          )}
        </div>
        <p className="text-sm font-semibold text-white">
          {isDragActive ? 'Drop to transcribe!' : 'Drop your audio here or click to browse'}
        </p>
        <p className="text-xs text-slate-500">MP3 · WAV · M4A · MP4 · no signup needed</p>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1 relative">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            value={importUrl}
            onChange={e => setImportUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlGo()}
            placeholder="Or paste a YouTube / TikTok URL…"
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <button
          onClick={handleUrlGo}
          disabled={!importUrl.trim()}
          className="px-5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all whitespace-nowrap"
        >
          Go
        </button>
      </div>
      <p className="mt-3 text-[10px] text-slate-600 text-center italic">
        Note: Some YouTube links may be restricted by the AI provider. Uploading files is 100% reliable.
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
const FEATURES = [
  { icon: Zap, title: 'Instant Analysis', desc: 'AI processes harmonics and rhythms in real-time, delivering results in seconds—not minutes.' },
  { icon: Music, title: 'Polyphonic Detection', desc: 'Recognizes complex chords, multiple instruments, and overlapping melodies simultaneously.' },
  { icon: FileText, title: 'ABC & PDF Export', desc: 'Export to standard ABC notation or print-ready PDF. MIDI and MusicXML coming soon.' },
  { icon: Mic, title: 'Live Recording', desc: 'Record directly from your microphone in the browser. No extra hardware or software needed.' },
  { icon: Globe, title: 'URL Import', desc: 'Paste any YouTube, TikTok, or Instagram link and we\'ll transcribe it automatically.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your audio is processed securely and never stored on our servers without consent.' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Kim',
    role: 'Piano Teacher · Boston, MA',
    avatar: 'SK',
    color: 'from-pink-500 to-rose-600',
    text: 'I transcribed a Chopin nocturne in under 3 minutes. The accuracy blew me away—this saves hours of work every week.',
    rating: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Music Producer · Nashville, TN',
    avatar: 'MW',
    color: 'from-indigo-500 to-purple-600',
    text: 'Finally I can quickly jot down ideas from my phone recordings into actual sheet music. The MT3 Pro engine is insane.',
    rating: 5,
  },
  {
    name: 'Yuki Tanaka',
    role: 'Composer · Tokyo, Japan',
    avatar: 'YT',
    color: 'from-cyan-500 to-teal-600',
    text: 'The URL import feature lets me transcribe reference tracks from YouTube instantly. Game-changer for my workflow.',
    rating: 5,
  },
];

const STATS = [
  { icon: BarChart3, label: 'Transcriptions Made', target: 52800, suffix: '+' },
  { icon: Globe, label: 'Countries', target: 124, suffix: '+' },
  { icon: Users, label: 'Active Musicians', target: 8400, suffix: '+' },
  { icon: Star, label: 'Avg. User Rating', target: 49, suffix: '/5', display: '4.9/5' },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-32 py-12">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full"
        >
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Sparkles size={10} /> Next-Gen Music AI · No Signup Needed
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4 leading-[1.05]"
        >
          Turn your audio into
          <br />
          <TypingText />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 max-w-2xl text-lg mb-10 leading-relaxed"
        >
          Upload any audio or paste a YouTube link — our AI converts it to professional sheet music in seconds. No music theory required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/studio"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            Open Studio Free <ChevronRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-2"
          >
            See How It Works <Play size={14} fill="white" />
          </a>
        </motion.div>

        {/* Hero Quick Uploader */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <HeroUploader />
        </motion.div>

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[900px] h-[500px] bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none" />
      </section>

      {/* ── Stats Bar ─────────────────────────────── */}
      <section className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {STATS.map(({ icon: Icon, label, target, suffix, display }) => (
            <motion.div
              key={label}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <Icon size={20} className="text-cyan-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {display ?? <AnimatedCounter target={target} suffix={suffix} />}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────── */}
      <section id="how-it-works" className="px-4">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-3">Why MuseScribe</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Everything you need to<br />capture your music</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              className="p-7 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md hover:border-cyan-500/30 transition-colors group"
            >
              <div className="w-11 h-11 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-5 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Examples ─────────────────────────── */}
      <section className="px-4 mb-24">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-3">See It In Action</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">AI Transcription Examples</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { img: '/images/piano_sheet_example_1778640625972.png', title: 'Classical Piano', desc: 'Complex polyphony and rhythms transcribed to standard notation.' },
            { img: '/images/guitar_tab_example_1778640661494.png', title: 'Guitar Riffs', desc: 'Accurate pitch detection rendered into guitar tablature.' },
            { img: '/images/piano_roll_example_1778640743205.png', title: 'Synth & Pop', desc: 'Interactive piano roll for producers and non-readers.' },
          ].map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="aspect-video overflow-hidden relative">
                <img src={ex.img} alt={ex.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{ex.title}</h3>
                    <p className="text-sm text-slate-300">{ex.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="px-4">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-3">Loved by Musicians</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Trusted by thousands<br />of music creators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-7 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-5"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="px-4 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-3">Got Questions?</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} {...faq} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA Banner ─────────────────────── */}
      <section className="px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-cyan-600/20 via-indigo-600/20 to-purple-600/20 border border-cyan-500/20 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Start transcribing for free
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
              No credit card. No signup required for your first transcription. Join 8,000+ musicians already using MuseScribe.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/studio"
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-white font-bold uppercase tracking-[0.2em] shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                Try It Free <ArrowRight size={16} />
              </Link>
              <Link
                to="/pricing"
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
              {['Free to start', 'No credit card', 'Cancel anytime', 'Export your work'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5">
                  <Check size={12} className="text-cyan-500" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
