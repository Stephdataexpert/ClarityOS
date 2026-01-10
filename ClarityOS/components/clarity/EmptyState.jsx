import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Users, Target } from 'lucide-react';

export default function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center text-center px-8"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Your brief will appear here</h3>
      <p className="text-slate-500 max-w-sm mb-8">
        Paste your content and click Generate Brief to transform it into actionable insights
      </p>
      
      <div className="grid grid-cols-3 gap-4 max-w-md w-full">
        {[
          { icon: FileText, label: 'Clear decisions' },
          { icon: Target, label: 'Next actions' },
          { icon: Users, label: 'Delegation' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-4 rounded-xl bg-slate-50 border border-slate-100"
          >
            <item.icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}