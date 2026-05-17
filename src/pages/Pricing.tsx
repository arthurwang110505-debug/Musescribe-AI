import { useState } from 'react';
import { Check, Zap, Star, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// ─── Pricing Tiers ────────────────────────────────────────
const TIERS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    quota: '10 min / month',
    description: 'Perfect for trying out AI transcription. No credit card required.',
    features: [
      '10 minutes of audio per month',
      'Standard AI engine (Basic Pitch)',
      'ABC notation export',
      'Score editor & preview',
      'Community support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/studio',
    popular: false,
    accent: 'border-white/10',
  },
  {
    name: 'Plus',
    monthlyPrice: 12,
    annualPrice: 8,
    quota: '60 min / month',
    description: 'For hobbyists and students who transcribe regularly.',
    features: [
      '60 minutes of audio per month',
      'Standard + MT3 Pro engine',
      'ABC & PDF export',
      'Chord AI suggestions',
      'Priority processing',
      'Email support',
    ],
    cta: 'Start Plus',
    ctaLink: '/auth',
    popular: false,
    accent: 'border-indigo-500/40',
  },
  {
    name: 'Pro',
    monthlyPrice: 32,
    annualPrice: 24,
    quota: '300 min / month',
    description: 'For serious musicians, teachers, and composers.',
    features: [
      '300 minutes of audio per month',
      'MT3 Pro & Gemini 1.5 engines',
      'ABC, PDF & MIDI export',
      'Unlimited chord suggestions',
      'URL import (YouTube / TikTok)',
      'API access (beta)',
      'Priority support',
    ],
    cta: 'Go Pro',
    ctaLink: '/auth',
    popular: true,
    accent: 'border-cyan-500',
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    quota: 'Unlimited',
    description: 'For music schools, studios, and production houses.',
    features: [
      'Unlimited audio processing',
      'Bulk batch processing',
      'Custom AI fine-tuning',
      'Dedicated account manager',
      'SLA guarantee',
      'White-label option',
    ],
    cta: 'Contact Sales',
    ctaLink: 'mailto:hello@musescribe.ai',
    popular: false,
    accent: 'border-white/10',
  },
];

// ─── FAQ ──────────────────────────────────────────────────
const FAQS = [
  { q: 'What counts as a "minute"?', a: 'One minute equals one minute of audio file duration. A 3-minute song costs 3 minutes from your quota.' },
  { q: 'Do unused minutes roll over?', a: 'Unused minutes expire at the end of each billing cycle. We recommend the Plus or Pro plan if you regularly exceed the free quota.' },
  { q: 'Can I switch plans anytime?', a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.' },
  { q: 'Is there a free trial for paid plans?', a: 'All paid plans include a 7-day free trial. Cancel anytime during the trial and you won\'t be charged.' },
];

function FaqAccordion({ q, a }: { q: string; a: string }) {
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

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="py-12 flex flex-col items-center px-4">

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">Pricing</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Start free. Scale as your music grows. Cancel anytime.
        </p>
      </div>

      {/* Annual / Monthly Toggle */}
      <div className="flex items-center gap-4 mb-12 p-1 bg-white/5 border border-white/10 rounded-full">
        <button
          onClick={() => setIsAnnual(false)}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!isAnnual ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${isAnnual ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
        >
          Annual
          <span className="bg-green-500/20 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-500/20">
            Save 33%
          </span>
        </button>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-7xl mb-20">
        {TIERS.map((tier, i) => {
          const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative p-7 rounded-3xl border flex flex-col ${tier.popular ? 'bg-white/10 shadow-2xl shadow-cyan-500/10 scale-[1.02]' : 'bg-white/5'} ${tier.accent}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  <Star size={10} fill="black" /> Most Popular
                </div>
              )}

              {/* Tier header */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  {price === null ? (
                    <span className="text-4xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">${price}</span>
                      <span className="text-slate-500 text-sm">/ mo</span>
                    </>
                  )}
                </div>
                {isAnnual && price !== null && price > 0 && (
                  <p className="text-[11px] text-slate-500">billed as ${price * 12}/yr</p>
                )}
                <div className={`mt-3 text-xs font-bold px-3 py-1 rounded-full inline-block ${tier.popular ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                  {tier.quota}
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.ctaLink.startsWith('mailto') ? (
                <a
                  href={tier.ctaLink}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all text-center bg-white/5 text-white border border-white/10 hover:bg-white/10"
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  to={tier.ctaLink}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all text-center block ${
                    tier.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02]'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Comparison note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-20">
        <HelpCircle size={14} className="text-slate-600" />
        All plans include the ABC score editor, live recording, and URL import features.
      </div>

      {/* FAQ */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Pricing FAQ</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => <FaqAccordion key={i} {...faq} />)}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <p className="text-slate-400 mb-4">Still not sure? Try it for free — no credit card needed.</p>
        <Link
          to="/studio"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-white font-bold uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition-all"
        >
          <Zap size={16} /> Start Transcribing Free
        </Link>
      </div>
    </div>
  );
}
