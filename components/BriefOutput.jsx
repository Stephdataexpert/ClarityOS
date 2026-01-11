<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Users,
  Copy,
  Download,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

const SectionCard = ({ title, icon: Icon, iconBg, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-100 transition-shadow"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const PriorityBadge = ({ priority }) => {
  const colors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-50 text-slate-600 border-slate-200'
  };
  return (
    <Badge variant="outline" className={`${colors[priority]} text-xs font-medium`}>
      {priority}
    </Badge>
  );
};

export default function BriefOutput({ brief }) {
  const [copied, setCopied] = useState(false);

  const formatBriefAsText = () => {
    let text = '# EXECUTIVE BRIEF\n\n';
    
    if (brief.executive_summary?.length) {
      text += '## Executive Summary\n';
      brief.executive_summary.forEach(point => text += `• ${point}\n`);
      text += '\n';
    }
    
    if (brief.key_decisions?.length) {
      text += '## Key Decisions Required\n';
      brief.key_decisions.forEach(d => {
        text += `• ${d.decision}\n`;
        if (d.options?.length) {
          d.options.forEach(opt => text += `  → ${opt}\n`);
        }
      });
      text += '\n';
    }
    
    if (brief.recommended_actions?.length) {
      text += '## Recommended Actions\n';
      brief.recommended_actions.forEach(a => {
        text += `• [${a.priority?.toUpperCase()}] ${a.action}`;
        if (a.owner) text += ` — Owner: ${a.owner}`;
        text += '\n';
      });
      text += '\n';
    }
    
    if (brief.risks_blindspots?.length) {
      text += '## Risks & Blind Spots\n';
      brief.risks_blindspots.forEach(r => text += `⚠ ${r}\n`);
      text += '\n';
    }
    
    if (brief.delegation_suggestions?.length) {
      text += '## Delegation Suggestions\n';
      brief.delegation_suggestions.forEach(d => {
        text += `• ${d.task} → ${d.delegate_to}`;
        if (d.reason) text += ` (${d.reason})`;
        text += '\n';
      });
    }
    
    return text;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatBriefAsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const text = formatBriefAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brief-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Your Brief</h2>
          <p className="text-sm text-slate-500 mt-1">Generated just now</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50"
          >
            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-600" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {brief.executive_summary?.length > 0 && (
        <SectionCard 
          title="Executive Summary" 
          icon={FileText} 
          iconBg="bg-slate-100 text-slate-600"
          delay={0}
        >
          <ul className="space-y-3">
            {brief.executive_summary.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <p className="text-[15px] text-slate-700 leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {brief.key_decisions?.length > 0 && (
        <SectionCard 
          title="Key Decisions Required" 
          icon={CheckCircle2} 
          iconBg="bg-emerald-100 text-emerald-600"
          delay={0.1}
        >
          <div className="space-y-4">
            {brief.key_decisions.map((decision, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[15px] font-medium text-slate-900 mb-2">{decision.decision}</p>
                {decision.options?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {decision.options.map((option, j) => (
                      <span 
                        key={j} 
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {brief.recommended_actions?.length > 0 && (
        <SectionCard 
          title="Recommended Actions" 
          icon={ArrowRight} 
          iconBg="bg-blue-100 text-blue-600"
          delay={0.2}
        >
          <div className="space-y-3">
            {brief.recommended_actions.map((action, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-[15px] text-slate-900">{action.action}</p>
                  {action.owner && (
                    <p className="text-sm text-slate-500 mt-1">Owner: {action.owner}</p>
                  )}
                </div>
                {action.priority && <PriorityBadge priority={action.priority} />}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {brief.risks_blindspots?.length > 0 && (
        <SectionCard 
          title="Risks & Blind Spots" 
          icon={AlertTriangle} 
          iconBg="bg-amber-100 text-amber-600"
          delay={0.3}
        >
          <ul className="space-y-3">
            {brief.risks_blindspots.map((risk, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[15px] text-slate-700">{risk}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {brief.delegation_suggestions?.length > 0 && (
        <SectionCard 
          title="Delegation Suggestions" 
          icon={Users} 
          iconBg="bg-purple-100 text-purple-600"
          delay={0.4}
        >
          <div className="space-y-3">
            {brief.delegation_suggestions.map((suggestion, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[15px] font-medium text-slate-900">{suggestion.task}</p>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-[15px] text-purple-600 font-medium">{suggestion.delegate_to}</span>
                </div>
                {suggestion.reason && (
                  <p className="text-sm text-slate-500">{suggestion.reason}</p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
=======
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Users,
  Copy,
  Download,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

const SectionCard = ({ title, icon: Icon, iconBg, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-100 transition-shadow"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const PriorityBadge = ({ priority }) => {
  const colors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-50 text-slate-600 border-slate-200'
  };
  return (
    <Badge variant="outline" className={`${colors[priority]} text-xs font-medium`}>
      {priority}
    </Badge>
  );
};

export default function BriefOutput({ brief }) {
  const [copied, setCopied] = useState(false);

  const formatBriefAsText = () => {
    let text = '# EXECUTIVE BRIEF\n\n';
    
    if (brief.executive_summary?.length) {
      text += '## Executive Summary\n';
      brief.executive_summary.forEach(point => text += `• ${point}\n`);
      text += '\n';
    }
    
    if (brief.key_decisions?.length) {
      text += '## Key Decisions Required\n';
      brief.key_decisions.forEach(d => {
        text += `• ${d.decision}\n`;
        if (d.options?.length) {
          d.options.forEach(opt => text += `  → ${opt}\n`);
        }
      });
      text += '\n';
    }
    
    if (brief.recommended_actions?.length) {
      text += '## Recommended Actions\n';
      brief.recommended_actions.forEach(a => {
        text += `• [${a.priority?.toUpperCase()}] ${a.action}`;
        if (a.owner) text += ` — Owner: ${a.owner}`;
        text += '\n';
      });
      text += '\n';
    }
    
    if (brief.risks_blindspots?.length) {
      text += '## Risks & Blind Spots\n';
      brief.risks_blindspots.forEach(r => text += `⚠ ${r}\n`);
      text += '\n';
    }
    
    if (brief.delegation_suggestions?.length) {
      text += '## Delegation Suggestions\n';
      brief.delegation_suggestions.forEach(d => {
        text += `• ${d.task} → ${d.delegate_to}`;
        if (d.reason) text += ` (${d.reason})`;
        text += '\n';
      });
    }
    
    return text;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatBriefAsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const text = formatBriefAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brief-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Your Brief</h2>
          <p className="text-sm text-slate-500 mt-1">Generated just now</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50"
          >
            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-600" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {brief.executive_summary?.length > 0 && (
        <SectionCard 
          title="Executive Summary" 
          icon={FileText} 
          iconBg="bg-slate-100 text-slate-600"
          delay={0}
        >
          <ul className="space-y-3">
            {brief.executive_summary.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <p className="text-[15px] text-slate-700 leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {brief.key_decisions?.length > 0 && (
        <SectionCard 
          title="Key Decisions Required" 
          icon={CheckCircle2} 
          iconBg="bg-emerald-100 text-emerald-600"
          delay={0.1}
        >
          <div className="space-y-4">
            {brief.key_decisions.map((decision, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[15px] font-medium text-slate-900 mb-2">{decision.decision}</p>
                {decision.options?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {decision.options.map((option, j) => (
                      <span 
                        key={j} 
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {brief.recommended_actions?.length > 0 && (
        <SectionCard 
          title="Recommended Actions" 
          icon={ArrowRight} 
          iconBg="bg-blue-100 text-blue-600"
          delay={0.2}
        >
          <div className="space-y-3">
            {brief.recommended_actions.map((action, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-[15px] text-slate-900">{action.action}</p>
                  {action.owner && (
                    <p className="text-sm text-slate-500 mt-1">Owner: {action.owner}</p>
                  )}
                </div>
                {action.priority && <PriorityBadge priority={action.priority} />}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {brief.risks_blindspots?.length > 0 && (
        <SectionCard 
          title="Risks & Blind Spots" 
          icon={AlertTriangle} 
          iconBg="bg-amber-100 text-amber-600"
          delay={0.3}
        >
          <ul className="space-y-3">
            {brief.risks_blindspots.map((risk, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[15px] text-slate-700">{risk}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {brief.delegation_suggestions?.length > 0 && (
        <SectionCard 
          title="Delegation Suggestions" 
          icon={Users} 
          iconBg="bg-purple-100 text-purple-600"
          delay={0.4}
        >
          <div className="space-y-3">
            {brief.delegation_suggestions.map((suggestion, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[15px] font-medium text-slate-900">{suggestion.task}</p>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-[15px] text-purple-600 font-medium">{suggestion.delegate_to}</span>
                </div>
                {suggestion.reason && (
                  <p className="text-sm text-slate-500">{suggestion.reason}</p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
>>>>>>> 2aaa0fd46a72c88410748350623567a479618763
