import React, { useState } from 'react';
import { Github, Rocket, Check, Copy, ExternalLink, Code, Terminal, Sparkles, Layers } from 'lucide-react';

export const VercelDeployModal: React.FC = () => {
  const [copiedVercelJson, setCopiedVercelJson] = useState(false);
  const [copiedGitCommands, setCopiedGitCommands] = useState(false);

  const vercelJsonCode = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const gitCommandsCode = `git init
git add .
git commit -m "Initial commit for ShafinBD Jobs"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shafinbd-jobs.git
git push -u origin main`;

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-900/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black">
            <Rocket className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              GitHub & Vercel Deployment Guide
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              How to export "ShafinBD Jobs", push to GitHub & host live on Vercel for free!
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Push to GitHub */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
            1
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Github className="w-5 h-5 text-slate-800" />
              <span>Step 1: Export & Push Code to GitHub</span>
            </h3>
            <p className="text-xs text-slate-500">
              Download/Export your codebase or run Git commands in your terminal
            </p>
          </div>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium list-decimal list-inside">
          <li>Click the <strong>Export / Download as ZIP</strong> or <strong>Push to GitHub</strong> button in AI Studio top right menu.</li>
          <li>Or run the following commands in your local project terminal:</li>
        </ol>

        <div className="relative bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
          <button
            onClick={() => copyToClipboard(gitCommandsCode, setCopiedGitCommands)}
            className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedGitCommands ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedGitCommands ? 'Copied Commands!' : 'Copy Commands'}</span>
          </button>
          <pre>{gitCommandsCode}</pre>
        </div>
      </div>

      {/* Step 2: Deploy on Vercel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
            2
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-600" />
              <span>Step 2: Deploy to Vercel in 1 Click</span>
            </h3>
            <p className="text-xs text-slate-500">
              Connect your GitHub repository to Vercel for automatic zero-config hosting
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
          <p>
            1. Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-purple-600 font-bold underline">Vercel.com</a> and sign in with GitHub.
          </p>
          <p>
            2. Click <strong>"Add New Project"</strong> → Select your GitHub repository <strong>shafinbd-jobs</strong>.
          </p>
          <p>
            3. Ensure the framework preset is set to <strong>Vite</strong> with output directory <code>dist</code>.
          </p>
          <p>
            4. Click <strong>Deploy</strong>! Your job portal will be live on a custom Vercel domain (e.g. <code>shafinbd-jobs.vercel.app</code>).
          </p>
        </div>

        {/* Optional vercel.json configuration */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-purple-600" />
              <span>Optional vercel.json (Single Page App Routing)</span>
            </span>
            <button
              onClick={() => copyToClipboard(vercelJsonCode, setCopiedVercelJson)}
              className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedVercelJson ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedVercelJson ? 'Copied vercel.json!' : 'Copy vercel.json'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-purple-300 p-4 rounded-2xl font-mono text-xs border border-slate-800">
            <pre>{vercelJsonCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
