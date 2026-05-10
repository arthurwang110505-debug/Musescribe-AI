import { motion } from 'motion/react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'How AI is Revolutionizing Music Transcription',
    excerpt: 'The days of manual ear-training for transcription are evolving. Discover how LLMs like Gemini are making sheet music creation faster than ever.',
    date: 'May 5, 2026',
    readTime: '5 min read',
    category: 'Technology'
  },
  {
    id: 2,
    title: 'Mastering ABC Notation: A Beginners Guide',
    excerpt: 'Learn the basics of ABC notation and how to use our built-in editor to polish your transcriptions into professional scores.',
    date: 'April 28, 2026',
    readTime: '8 min read',
    category: 'Education'
  },
  {
    id: 3,
    title: 'Top 5 Tips for High-Quality Audio Captures',
    excerpt: 'Better input leads to better output. Learn how to record your performances to get the most accurate AI transcriptions possible.',
    date: 'April 15, 2026',
    readTime: '4 min read',
    category: 'Tutorial'
  }
];

export default function Blog() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 italic tracking-tight">The Muse<span className="text-cyan-400">Log</span></h1>
        <p className="text-slate-400 max-w-xl">Insights, tutorials, and stories from the intersection of artificial intelligence and musical creativity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <div className="h-48 bg-gradient-to-br from-indigo-900/50 to-cyan-900/50 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-black/60 backdrop-blur-md text-[10px] text-cyan-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium mb-4 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar size={12}/> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={12}/> {post.readTime}</span>
              </div>
              
              <h2 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
                {post.title}
              </h2>
              
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-[0.2em] group-hover:gap-2 transition-all">
                Read Article <ChevronRight size={14} className="text-cyan-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
