<<<<<<< HEAD
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, Sparkles, Loader2 } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import ContextSelector from './ContextSelector';

export default function InputPanel({ onGenerate, isLoading }) {
  const [text, setText] = useState('');
  const [context, setContext] = useState('inbox');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      setFile({ name: selectedFile.name, url: file_url });
      setText(''); // Clear text input when file is uploaded
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const handleGenerate = () => {
    if (!text.trim() && !file) return;
    onGenerate({ text, context, fileUrl: file?.url });
  };

  const canGenerate = (text.trim().length > 0 || file) && !isLoading;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Context
        </label>
        <ContextSelector value={context} onChange={setContext} />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Input
        </label>
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim() && file) {
                setFile(null); // Clear file when user starts typing
              }
            }}
            placeholder="Paste your emails, meeting notes, Slack threads, or reports here..."
            className="min-h-[280px] bg-white border-slate-200 rounded-xl p-5 text-slate-900 placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-[15px] leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400">
            {text.length > 0 && `${text.length.toLocaleString()} chars`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="file"
          ref__={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="h-12 px-5 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-[15px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Brief...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Brief
          </>
        )}
      </Button>
    </div>
  );
}
=======
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, Sparkles, Loader2 } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import ContextSelector from './ContextSelector';

export default function InputPanel({ onGenerate, isLoading }) {
  const [text, setText] = useState('');
  const [context, setContext] = useState('inbox');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      setFile({ name: selectedFile.name, url: file_url });
      setText(''); // Clear text input when file is uploaded
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const handleGenerate = () => {
    if (!text.trim() && !file) return;
    onGenerate({ text, context, fileUrl: file?.url });
  };

  const canGenerate = (text.trim().length > 0 || file) && !isLoading;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Context
        </label>
        <ContextSelector value={context} onChange={setContext} />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Input
        </label>
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim() && file) {
                setFile(null); // Clear file when user starts typing
              }
            }}
            placeholder="Paste your emails, meeting notes, Slack threads, or reports here..."
            className="min-h-[280px] bg-white border-slate-200 rounded-xl p-5 text-slate-900 placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-[15px] leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400">
            {text.length > 0 && `${text.length.toLocaleString()} chars`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="file"
          ref__={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="h-12 px-5 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-[15px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Brief...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Brief
          </>
        )}
      </Button>
    </div>
  );
}
>>>>>>> 2aaa0fd46a72c88410748350623567a479618763
