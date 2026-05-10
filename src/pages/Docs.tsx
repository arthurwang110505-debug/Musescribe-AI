import { Book, Code, FileAudio, Music2 } from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    content: [
      { q: 'What is MuseScribe AI?', a: 'MuseScribe AI is a state-of-the-art tool that uses artificial intelligence to convert audio and video recordings into professional musical notation.' },
      { q: 'How do I start?', a: 'Simply upload an MP3, WAV, or MP4 file in the Studio, and our AI will begin analyzing the harmonics and rhythms immediately.' },
    ]
  },
  {
    title: 'Supported Formats',
    icon: FileAudio,
    content: [
      { q: 'Audio Files', a: 'We support .mp3, .wav, .ogg, and .m4a files up to 20MB in size.' },
      { q: 'Video Files', a: 'You can also upload .mp4, .mov, and .webm files. We only analyze the audio track.' },
    ]
  },
  {
    title: 'ABC Notation',
    icon: Music2,
    content: [
      { q: 'What is ABC Notation?', a: 'ABC is a text-based musical notation language. It allows for easy storage and sharing of musical scores in a lightweight format.' },
      { q: 'Can I edit the output?', a: 'Yes! Our built-in ABC Editor allows you to manually adjust notes, add chords, and change key signatures.' },
    ]
  }
];

export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
        <p className="text-slate-400">Everything you need to know about MuseScribe AI.</p>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.title} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <section.icon className="text-cyan-400" size={24} />
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
            </div>
            
            <div className="space-y-8">
              {section.content.map((item) => (
                <div key={item.q}>
                  <h3 className="text-sm font-bold text-cyan-100 mb-2 uppercase tracking-wider">{item.q}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
