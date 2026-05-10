import { Scale } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-cyan-400">
          <Scale size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] mt-1">Last Updated: May 9, 2026</p>
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-white text-lg font-bold mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using MuseScribe AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">2. Description of Service</h2>
          <p>MuseScribe AI provides AI-powered musical transcription services. We convert audio/video files into musical notation formats. The accuracy of transcription depends on the quality of input audio.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">3. User Conduct</h2>
          <p>You agree not to use the service for any illegal purposes or to upload content that infringes upon the intellectual property rights of others. You are solely responsible for the content you upload.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">4. Intellectual Property</h2>
          <p>You retain all rights to your original audio files and the resulting transcriptions. MuseScribe AI claims no ownership over user-generated content.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">5. Limitation of Liability</h2>
          <p>MuseScribe AI is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use our services.</p>
        </section>
      </div>
    </div>
  );
}
