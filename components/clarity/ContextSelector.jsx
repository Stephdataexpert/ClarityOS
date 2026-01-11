<<<<<<< HEAD
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, Users, Target, Settings } from 'lucide-react';

const contexts = [
  { value: 'inbox', label: 'Inbox', icon: Inbox, description: 'Emails, messages, threads' },
  { value: 'meeting', label: 'Meeting', icon: Users, description: 'Notes, transcripts, recaps' },
  { value: 'strategy', label: 'Strategy', icon: Target, description: 'Plans, proposals, analysis' },
  { value: 'operations', label: 'Operations', icon: Settings, description: 'Reports, updates, status' },
];

export default function ContextSelector({ value, onChange }) {
  const selected = contexts.find(c => c.value === value);
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 bg-white border-slate-200 rounded-xl px-4 hover:border-slate-300 transition-colors">
        <SelectValue>
          {selected && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <selected.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{selected.label}</p>
                <p className="text-xs text-slate-500">{selected.description}</p>
              </div>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-200">
        {contexts.map((context) => (
          <SelectItem 
            key={context.value} 
            value={context.value}
            className="py-3 px-4 rounded-lg cursor-pointer focus:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <context.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{context.label}</p>
                <p className="text-xs text-slate-500">{context.description}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

=======
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, Users, Target, Settings } from 'lucide-react';

const contexts = [
  { value: 'inbox', label: 'Inbox', icon: Inbox, description: 'Emails, messages, threads' },
  { value: 'meeting', label: 'Meeting', icon: Users, description: 'Notes, transcripts, recaps' },
  { value: 'strategy', label: 'Strategy', icon: Target, description: 'Plans, proposals, analysis' },
  { value: 'operations', label: 'Operations', icon: Settings, description: 'Reports, updates, status' },
];

export default function ContextSelector({ value, onChange }) {
  const selected = contexts.find(c => c.value === value);
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 bg-white border-slate-200 rounded-xl px-4 hover:border-slate-300 transition-colors">
        <SelectValue>
          {selected && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <selected.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{selected.label}</p>
                <p className="text-xs text-slate-500">{selected.description}</p>
              </div>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-200">
        {contexts.map((context) => (
          <SelectItem 
            key={context.value} 
            value={context.value}
            className="py-3 px-4 rounded-lg cursor-pointer focus:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <context.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{context.label}</p>
                <p className="text-xs text-slate-500">{context.description}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

>>>>>>> 2aaa0fd46a72c88410748350623567a479618763
