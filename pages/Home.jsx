import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import InputPanel from '@/components/clarity/InputPanel';
import BriefOutput from '@/components/clarity/BriefOutput';
import EmptyState from '@/components/clarity/EmptyState';
import UsageIndicator from '@/components/clarity/UsageIndicator';
import { Sparkles, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const FREE_LIMIT = 10;

export default function Home() {
  const [brief, setBrief] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setUsageCount(userData.briefs_count || 0);
    } catch (e) {
      // User not logged in
    }
  };

  const handleGenerate = async ({ text, context, fileUrl }) => {
    setIsLoading(true);
    setBrief(null);

    try {
      let inputContent = text;
      
      // If file was uploaded, extract its content
      if (fileUrl && !text.trim()) {
        const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url: fileUrl,
          json_schema: {
            type: "object",
            properties: {
              content: { type: "string", description: "The full text content of the document" }
            }
          }
        });
        if (extractResult.status === 'success' && extractResult.output?.content) {
          inputContent = extractResult.output.content;
        }
      }

      const contextPrompts = {
        inbox: "This is email/message content. Focus on action items, decisions needed, and who needs to respond.",
        meeting: "This is meeting notes/transcript. Extract key decisions made, action items assigned, and follow-ups needed.",
        strategy: "This is strategic content. Focus on key initiatives, risks, trade-offs, and decision points.",
        operations: "This is operational content. Focus on status updates, blockers, resource needs, and process improvements."
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Chief of Staff assistant. Analyze the following ${context} content and create an executive brief.

CONTEXT TYPE: ${context.toUpperCase()}
${contextPrompts[context]}

CONTENT TO ANALYZE:
${inputContent}

Create a structured executive brief with:
1. Executive Summary: Maximum 5 bullet points capturing the essence. Be concise and specific.
2. Key Decisions Required: List decisions that need to be made. For each, provide clear options (yes/no or specific choices).
3. Recommended Actions: Specific next steps with suggested owners and priority levels (high/medium/low).
4. Risks & Blind Spots: What could go wrong? What might be missing from this information?
5. Delegation Suggestions: What tasks can be delegated, to whom (by role), and why.

RULES:
- Be direct and confident
- No fluff or generic advice
- If information is missing, state your assumptions
- Prioritize clarity over completeness
- Use professional, executive-level language
- Each bullet should be actionable or informative, not filler`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: {
              type: "array",
              items: { type: "string" },
              description: "Max 5 key points"
            },
            key_decisions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  decision: { type: "string" },
                  options: { type: "array", items: { type: "string" } }
                }
              }
            },
            recommended_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  owner: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            },
            risks_blindspots: {
              type: "array",
              items: { type: "string" }
            },
            delegation_suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  task: { type: "string" },
                  delegate_to: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      setBrief(result);

      // Save brief and update usage
      await base44.entities.Brief.create({
        input_text: inputContent,
        context_type: context,
        file_url: fileUrl,
        ...result
      });

      if (user) {
        const newCount = (user.briefs_count || 0) + 1;
        await base44.auth.updateMe({ briefs_count: newCount });
        setUsageCount(newCount);
      }

    } catch (error) {
      console.error('Generation failed:', error);
    }
    
    setIsLoading(false);
  };

  const isPro = user?.subscription === 'pro';
  const canGenerate = isPro || usageCount < FREE_LIMIT;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight">ClarityOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to={createPageUrl('History')}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <UsageIndicator used={usageCount} limit={FREE_LIMIT} isPro={isPro} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create Brief</h1>
              <p className="text-slate-500">Transform messy inputs into decision-ready insights</p>
            </div>
            <InputPanel 
              onGenerate={handleGenerate} 
              isLoading={isLoading}
              disabled={!canGenerate}
            />
            {!canGenerate && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <p className="text-sm text-amber-800">
                  You've reached your free limit. Upgrade to Pro for unlimited briefs.
                </p>
              </motion.div>
            )}
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-[600px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-8 h-8 text-slate-400" />
                    </motion.div>
                  </div>
                  <p className="text-slate-600 font-medium">Analyzing your content...</p>
                  <p className="text-sm text-slate-400 mt-1">This takes about 15-30 seconds</p>
                </motion.div>
              ) : brief ? (
                <motion.div
                  key="brief"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BriefOutput brief={brief} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
