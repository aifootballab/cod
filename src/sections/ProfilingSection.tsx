import { useState } from 'react';
import { User, Target, Zap, Trophy, TrendingUp, Users, Brain, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { PlayerProfile, DetectedWeapon } from '@/lib/rag-engine';

interface ProfilingSectionProps {
  profile: PlayerProfile | null;
  detectedWeapons: DetectedWeapon[];
  isLoading: boolean;
}

export function ProfilingSection({ profile, detectedWeapons, isLoading }: ProfilingSectionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'arsenal' | 'audience'>('overview');

  if (isLoading) {
    return (
      <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen pt-28">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            PROFILAZIONE <span className="text-orange-500">IA</span>
          </h2>
          <p className="text-gray-500 font-mono">
            Analisi RAG in corso...<br />
            Matching con database armi...<br />
            Generazione persona...
          </p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-orange-500" />
          <h2 className="text-3xl font-black text-white mb-4">NESSUN PROFILO</h2>
          <p className="text-gray-500">Carica uno screenshot del tuo profilo COD per iniziare la profilazione</p>
        </div>
      </section>
    );
  }

  const personaColors: Record<string, string> = {
    meta_warrior: 'text-cyan-400 border-cyan-500',
    skilled_hipster: 'text-purple-400 border-purple-500',
    completionist: 'text-emerald-400 border-emerald-500',
    aggressive_grinder: 'text-red-400 border-red-500',
    tactical_sniper: 'text-amber-400 border-amber-500',
    casual_regular: 'text-gray-400 border-gray-500'
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-orange-500/30 bg-orange-500/5">
            <Brain className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-xs font-mono tracking-widest">RAG ANALYSIS COMPLETE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            PROFILO <span className="text-orange-500">OPERATIVO</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: User },
            { id: 'arsenal', label: 'ARSENALE', icon: Target },
            { id: 'audience', label: 'AUDIENCE', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 border font-mono text-sm tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'border-orange-500 bg-orange-500 text-black'
                  : 'border-gray-700 text-gray-500 hover:border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Persona Card */}
            <div className={`p-8 border ${personaColors[profile.personaType]?.split(' ')[1] || 'border-gray-700'} bg-gradient-to-r from-[#111] to-[#0a0a0a]`}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <p className="text-gray-500 text-sm font-mono mb-2">PERSONA TYPE</p>
                  <h3 className={`text-5xl font-black ${personaColors[profile.personaType]?.split(' ')[0] || 'text-white'}`} style={{ fontFamily: 'Black Ops One, cursive' }}>
                    {profile.personaType.replace('_', ' ').toUpperCase()}
                  </h3>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <StatBox label="SKILL TIER" value={profile.skillTier.toUpperCase()} color="orange" />
                  <StatBox label="ENGAGEMENT" value={`${profile.engagementScore}/100`} color="emerald" />
                  <StatBox label="CHURN RISK" value={`${profile.churnRisk}%`} color={profile.churnRisk > 50 ? 'red' : 'emerald'} />
                </div>
              </div>
            </div>

            {/* Playstyle Tags */}
            <div className="p-6 border border-gray-800 bg-[#111]">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                PLAYSTYLE TAGS
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.playstyleTags.map((tag) => (
                  <span key={tag} className="px-4 py-2 border border-orange-500/30 text-orange-400 text-sm font-mono">
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              {profile.recommendations.map((rec, i) => (
                <div key={i} className="p-6 border border-gray-800 bg-[#111] hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {rec.type === 'weapon' && <Target className="w-5 h-5 text-cyan-400" />}
                    {rec.type === 'content' && <TrendingUp className="w-5 h-5 text-purple-400" />}
                    {rec.type === 'tip' && <Zap className="w-5 h-5 text-amber-400" />}
                    <span className="text-gray-500 text-xs font-mono">{rec.type.toUpperCase()}</span>
                    <span className="ml-auto text-xs text-gray-600 font-mono">{(rec.confidence * 100).toFixed(0)}% match</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{rec.title}</h4>
                  <p className="text-gray-400 text-sm">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'arsenal' && (
          <div className="space-y-6">
            <p className="text-gray-400 text-center mb-8">
              Armi identificate tramite RAG matching con database
            </p>
            {detectedWeapons.map((weapon, i) => (
              <div key={i} className="p-6 border border-gray-800 bg-[#111]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-xs font-mono mb-1">{weapon.category.toUpperCase()}</p>
                    <h4 className="text-2xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                      {weapon.name}
                    </h4>
                    <p className="text-orange-400 text-sm font-mono">
                      Confidence: {(weapon.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="px-3 py-1 border border-gray-700 text-gray-500 text-xs font-mono">
                    {weapon.attachments.length} ATTACHMENTS
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-3">
                  {weapon.attachments.map((att, j) => (
                    <div key={j} className="p-3 border-l-2 border-orange-500 bg-orange-500/5">
                      <p className="text-orange-400 text-xs font-mono mb-1">{att.slot.toUpperCase()}</p>
                      <p className="text-white text-sm font-bold">{att.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-6 text-gray-600" />
            <h4 className="text-xl font-bold text-white mb-4">LOOKALIKE AUDIENCE</h4>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              Trova altri giocatori con profilo simile per segmentazione marketing
              o matchmaking avanzato.
            </p>
            <button className="px-8 py-3 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all font-mono">
              GENERA AUDIENCE SIMILE
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    orange: 'text-orange-400 border-orange-500',
    emerald: 'text-emerald-400 border-emerald-500',
    red: 'text-red-400 border-red-500',
  };

  return (
    <div className={`p-4 border ${colorClasses[color]?.split(' ')[1] || 'border-gray-700'} bg-[#0a0a0a] text-center`}>
      <p className="text-gray-500 text-xs font-mono mb-1">{label}</p>
      <p className={`text-2xl font-black ${colorClasses[color]?.split(' ')[0] || 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
