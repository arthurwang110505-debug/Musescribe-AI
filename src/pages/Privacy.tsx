import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-cyan-400">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] mt-1">Last Updated: May 9, 2026</p>
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-white text-lg font-bold mb-4">1. Information We Collect</h2>
          <p>We collect the audio and video files you upload solely for the purpose of performing AI transcription. We also collect basic usage analytics to improve our services.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">2. Data Security</h2>
          <p>Your uploaded files are processed through secure channels. We use industry-standard encryption to protect your data during transmission and processing.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">3. AI Processing</h2>
          <p>Files are processed using Google's Gemini AI models. By using our service, you acknowledge that your audio data will be sent to Google's servers for analysis.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">4. Data Retention</h2>
          <p>Uploaded files are deleted from our servers immediately after transcription is completed. We do not store your original audio files permanently.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-4">5. Your Rights</h2>
          <p>You have the right to access, modify, or delete any personal information we may hold about you. Contact us for any privacy-related requests.</p>
        </section>
      </div>
    </div>
  );
}
