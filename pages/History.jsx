import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Inbox, 
  Users, 
  Target, 
  Settings, 
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BriefOutput from '@/components/clarity/BriefOutput';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const contextIcons = {
  inbox: Inbox,
  meeting: Users,
  strategy: Target,
  operations: Settings
};

const contextColors = {
  inbox: 'bg-blue-100 text-blue-600',
  meeting: 'bg-purple-100 text-purple-600',
  strategy: 'bg-emerald-100 text-emerald-600',
  operations: 'bg-orange-100 text-orange-600'
};

export default function History() {
  const [selectedBrief, setSelectedBrief] = useState(null);

  const { data: briefs = [], isLoading } = useQuery({
    queryKey: ['briefs'],
    queryFn: () => base44.entities.Brief.list('-created_date', 50)
  });

  const Icon = selectedBrief ? contextIcons[selectedBrief.context_type] : FileText;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight">ClarityOS</span>
          </Link>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
              New Brief
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Brief History</h1>
          <p className="text-slate-500">Review your past executive briefs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Briefs List */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))
            ) : briefs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No briefs yet</p>
                <p className="text-sm text-slate-400 mt-1">Create your first brief to get started</p>
                <Link to={createPageUrl('Home')}>
                  <Button className="mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                    Create Brief
                  </Button>
                </Link>
              </div>
            ) : (
              briefs.map((brief, i) => {
                const ContextIcon = contextIcons[brief.context_type] || FileText;
                const isSelected = selectedBrief?.id === brief.id;
                
                return (
                  <motion.button
                    key={brief.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedBrief(brief)}
                    className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${
                      isSelected 
                        ? 'border-slate-900 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg ${contextColors[brief.context_type]} flex items-center justify-center flex-shrink-0`}>
                          <ContextIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {brief.executive_summary?.[0]?.slice(0, 50) || 'Untitled Brief'}
                            {brief.executive_summary?.[0]?.length > 50 && '...'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(brief.created_date), 'MMM d, yyyy · h:mm a')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Brief Detail */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-[600px]">
              {selectedBrief ? (
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className={`w-10 h-10 rounded-xl ${contextColors[selectedBrief.context_type]} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="capitalize mb-1">
                        {selectedBrief.context_type}
                      </Badge>
                      <p className="text-xs text-slate-500">
                        {format(new Date(selectedBrief.created_date), 'MMMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  </div>
                  <BriefOutput brief={selectedBrief} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">Select a brief to view</p>
                  <p className="text-sm text-slate-400 mt-1">Choose from your history on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

