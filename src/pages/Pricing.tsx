import { Check, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with AI transcription.',
    features: ['5 transcriptions per month', 'Standard AI model', 'ABC & PDF export', 'Community support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For serious musicians and composers.',
    features: ['Unlimited transcriptions', 'Premium Gemini 1.5 Pro model', 'Chord suggestions', 'MIDI export (Soon)', 'Priority support'],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For music schools and production houses.',
    features: ['Bulk processing', 'API Access', 'Custom AI fine-tuning', 'Dedicated account manager'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="py-12 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Choose the plan that's right for your musical journey. Scale as you grow from a hobbyist to a professional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`
              relative p-8 rounded-3xl border flex flex-col
              ${tier.popular ? 'bg-white/10 border-cyan-500 shadow-2xl shadow-cyan-500/10' : 'bg-white/5 border-white/10'}
            `}
          >
            {tier.popular && (
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </span>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-slate-500">/mo</span>}
              </div>
              <p className="text-sm text-slate-400 mt-4">{tier.description}</p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check size={16} className="text-cyan-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`
              w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all
              ${tier.popular 
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02]' 
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}
            `}>
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
