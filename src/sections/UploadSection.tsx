import { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Scan, Cpu, Database, FileCheck, AlertTriangle } from 'lucide-react';

interface UploadSectionProps {
  onAnalysisStart: (file: File) => void;
  isAnalyzing: boolean;
  progress: number;
  stageText: string;
  error?: string | null;
}

export function UploadSection({ onAnalysisStart, isAnalyzing, progress, stageText, error }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isAnalyzing) setDragActive(true);
  }, [isAnalyzing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (isAnalyzing) return;
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(f => f.type.startsWith('image/'));
    if (imageFile) handleFileSelect(imageFile);
  }, [isAnalyzing]);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File troppo grande. Massimo 10MB.');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleStartAnalysis = () => {
    if (selectedFile) onAnalysisStart(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="upload-section" className="py-24 px-4 bg-[#0a0a0a] relative">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 107, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 0, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-orange-500/30 bg-orange-500/5">
            <Scan className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-xs font-mono tracking-widest">UPLOAD MODULE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            CARICA <span className="text-orange-500">STATS</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Scatta uno screenshot della schermata statistiche di Call of Duty
          </p>
        </div>

        {/* Upload Area */}
        <div 
          className={`relative border-2 border-dashed transition-all duration-300 ${
            isAnalyzing 
              ? 'border-orange-500/30 bg-orange-500/5' 
              : dragActive 
                ? 'border-orange-500 bg-orange-500/10' 
                : 'border-gray-700 bg-[#111] hover:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isAnalyzing && !selectedFile && fileInputRef.current?.click()}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
          
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} disabled={isAnalyzing} />
          
          <div className="p-12 text-center">
            {!selectedFile ? (
              // Empty State
              <>
                <div className={`w-24 h-24 mx-auto mb-6 border-2 ${dragActive ? 'border-orange-500 bg-orange-500/20' : 'border-gray-700 bg-gray-900'} flex items-center justify-center transition-all`}>
                  {isAnalyzing ? (
                    <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className={`w-12 h-12 ${dragActive ? 'text-orange-500' : 'text-gray-600'}`} />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                  {dragActive ? 'RILASCIA QUI' : 'TRASCINA SCREENSHOT'}
                </h3>
                <p className="text-gray-500 mb-6">o clicca per selezionare un file</p>
                
                <div className="flex justify-center gap-3">
                  <span className="px-3 py-1 border border-gray-700 text-gray-600 text-xs font-mono">PNG</span>
                  <span className="px-3 py-1 border border-gray-700 text-gray-600 text-xs font-mono">JPG</span>
                  <span className="px-3 py-1 border border-gray-700 text-gray-600 text-xs font-mono">MAX 10MB</span>
                </div>
              </>
            ) : (
              // File Selected
              <div className="relative">
                {!isAnalyzing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClear(); }}
                    className="absolute -top-4 -right-4 w-10 h-10 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                )}
                
                {preview && (
                  <div className="mb-6 relative">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto border border-gray-800" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-3 mb-6">
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-mono">{selectedFile.name}</span>
                  <span className="text-gray-600 text-sm font-mono">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                
                {error ? (
                  // Error State
                  <div className="max-w-md mx-auto p-6 border border-red-500/30 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                      <h4 className="text-red-400 font-bold tracking-wider">ANALISI FALLITA</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{error}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClear(); }}
                      className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-sm"
                    >
                      RIPROVA
                    </button>
                  </div>
                ) : isAnalyzing ? (
                  // Analysis Progress
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-orange-400 font-mono text-sm flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        {stageText}
                      </span>
                      <span className="text-orange-400 font-mono text-sm">{progress}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-gray-800 relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                    
                    {/* Process indicators */}
                    <div className="flex justify-center gap-6 mt-4">
                      <div className={`flex items-center gap-2 ${progress >= 20 ? 'text-orange-400' : 'text-gray-700'}`}>
                        <FileCheck className="w-4 h-4" />
                        <span className="text-xs font-mono">UPLOAD</span>
                      </div>
                      <div className={`flex items-center gap-2 ${progress >= 40 ? 'text-orange-400' : 'text-gray-700'}`}>
                        <Scan className="w-4 h-4" />
                        <span className="text-xs font-mono">OCR</span>
                      </div>
                      <div className={`flex items-center gap-2 ${progress >= 70 ? 'text-orange-400' : 'text-gray-700'}`}>
                        <Cpu className="w-4 h-4" />
                        <span className="text-xs font-mono">AI</span>
                      </div>
                      <div className={`flex items-center gap-2 ${progress >= 90 ? 'text-orange-400' : 'text-gray-700'}`}>
                        <Database className="w-4 h-4" />
                        <span className="text-xs font-mono">RAG</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Start Button
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartAnalysis(); }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 opacity-70 group-hover:opacity-100 blur transition-opacity" />
                    <div className="relative px-10 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold tracking-widest uppercase">
                      AVVIA ANALISI
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'CARICA', desc: 'Screenshot statistiche COD', icon: ImageIcon },
            { num: '02', title: 'ANALIZZA', desc: 'AI estrae K/D, accuracy, SPM', icon: Scan },
            { num: '03', title: 'OTTIMIZZA', desc: 'Ricevi build META personalizzate', icon: Cpu },
          ].map((step, i) => (
            <div key={i} className="relative p-6 border border-gray-800 bg-[#111] group hover:border-orange-500/50 transition-colors">
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-orange-500/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-orange-500/50" />
              
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-orange-500/30" style={{ fontFamily: 'Black Ops One, cursive' }}>
                  {step.num}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-5 h-5 text-orange-500" />
                    <h4 className="text-white font-bold tracking-wider">{step.title}</h4>
                  </div>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}
