import { useState } from 'react';
import { Target, Crosshair, Zap, Trophy, Clock, Skull, Check, X, AlertTriangle, Lightbulb, ChevronRight, BarChart3, Award } from 'lucide-react';
import type { Analysis } from '@/types';
import { getRank, getRankColor } from '@/data/weaponDatabase';

interface ResultsSectionProps {
  analysis: Analysis;
  onNewAnalysis?: () => void;
}

export function ResultsSection({ analysis, onNewAnalysis }: ResultsSectionProps) {
  const [activeBuild, setActiveBuild] = useState(0);
  const [activeTab, setActiveTab] = useState<'stats' | 'builds' | 'tips'>('stats');
  
  const stats = analysis.extracted_stats;
  const builds = analysis.recommended_builds;
  const rank = getRank(stats.kd_ratio, stats.accuracy);
  const rankColor = getRankColor(rank);

  const statCards = [
    { icon: Target, label: 'K/D RATIO', value: stats.kd_ratio.toFixed(2), color: stats.kd_ratio < 1 ? 'text-red-500' : stats.kd_ratio < 1.5 ? 'text-amber-500' : 'text-emerald-500', subtext: stats.kd_ratio < 1 ? 'BELOW AVG' : stats.kd_ratio < 1.5 ? 'GOOD' : 'ELITE' },
    { icon: Crosshair, label: 'ACCURACY', value: `${stats.accuracy}%`, color: stats.accuracy < 18 ? 'text-red-500' : stats.accuracy < 28 ? 'text-amber-500' : 'text-emerald-500', subtext: stats.accuracy < 18 ? 'NEEDS WORK' : stats.accuracy < 28 ? 'AVERAGE' : 'EXCELLENT' },
    { icon: Zap, label: 'SPM', value: stats.spm.toString(), color: stats.spm < 250 ? 'text-red-500' : stats.spm < 350 ? 'text-amber-500' : 'text-emerald-500', subtext: stats.spm < 250 ? 'PASSIVE' : stats.spm < 350 ? 'ACTIVE' : 'AGGRESSIVE' },
    { icon: Trophy, label: 'WIN RATE', value: `${stats.win_rate}%`, color: stats.win_rate < 48 ? 'text-red-500' : stats.win_rate < 55 ? 'text-amber-500' : 'text-emerald-500', subtext: stats.win_rate < 48 ? 'LOSING' : 'WINNING' },
  ];

  const getBarColor = (v: number) => v < 50 ? 'bg-red-500' : v < 70 ? 'bg-amber-500' : v < 85 ? 'bg-emerald-500' : 'bg-cyan-500';

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] relative">
      {/* Background */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(255, 107, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 0, 0.5) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-emerald-500/30 bg-emerald-500/5">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 text-xs font-mono tracking-widest">ANALYSIS COMPLETE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            RISULTATI <span className="text-orange-500">OPERATIVI</span>
          </h2>
          <p className="text-gray-500">ID: {analysis.id} | {new Date(analysis.created_at).toLocaleString()}</p>
        </div>

        {/* Rank Card */}
        <div className="mb-12 p-8 border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-amber-500/10 relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm font-mono mb-2">OPERATOR RANK</p>
              <h3 className={`text-6xl font-black ${rankColor}`} style={{ fontFamily: 'Black Ops One, cursive' }}>
                {rank}
              </h3>
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between text-sm font-mono mb-2">
                <span className="text-gray-500">RANK PROGRESS</span>
                <span className="text-orange-400">{(stats.kd_ratio * 100 + stats.accuracy * 10).toFixed(0)} PTS</span>
              </div>
              <div className="h-3 bg-gray-800 relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${Math.min((stats.kd_ratio * 100 + stats.accuracy * 10) / 5, 100)}%` }} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm font-mono mb-2">PLAYSTYLE</p>
              <p className="text-xl font-bold text-white tracking-wider">{stats.playstyle_detected.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'stats', label: 'STATISTICHE', icon: BarChart3 },
            { id: 'builds', label: 'LOADOUT', icon: Target },
            { id: 'tips', label: 'TATTICHE', icon: Lightbulb },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 border font-mono text-sm tracking-wider transition-all ${
                activeTab === tab.id 
                  ? 'border-orange-500 bg-orange-500/20 text-orange-400' 
                  : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Main Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, i) => (
                <div key={i} className="p-6 border border-gray-800 bg-[#111] relative group hover:border-orange-500/50 transition-colors">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-700 group-hover:border-orange-500/50" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-700 group-hover:border-orange-500/50" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 border border-gray-700 flex items-center justify-center">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-gray-500 text-xs font-mono">{stat.label}</span>
                  </div>
                  
                  <p className={`text-4xl font-black mb-2 ${stat.color}`} style={{ fontFamily: 'Black Ops One, cursive' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 font-mono">{stat.subtext}</p>
                </div>
              ))}
            </div>

            {/* Detailed Stats */}
            <div className="p-6 border border-gray-800 bg-[#111]">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                STATISTICHE DETTAGLIATE
              </h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { icon: Skull, label: 'KILLS', value: stats.total_kills.toLocaleString() },
                  { icon: X, label: 'DEATHS', value: stats.total_deaths.toLocaleString() },
                  { icon: Target, label: 'HEADSHOT %', value: `${stats.headshot_percent}%` },
                  { icon: Clock, label: 'PLAY TIME', value: `${Math.floor(stats.play_time_hours)}H` },
                  { icon: Trophy, label: 'LEVEL', value: stats.level.toString() },
                  { icon: Zap, label: 'BEST WEAPON', value: stats.best_weapon },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 border border-gray-800 bg-[#0a0a0a]">
                    <item.icon className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-600 text-xs font-mono mb-1">{item.label}</p>
                    <p className="text-white font-bold font-mono">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="p-6 border border-orange-500/30 bg-orange-500/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-500" />
                ANALISI INTELLIGENZA ARTIFICIALE
              </h3>
              <pre className="text-gray-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {analysis.ai_analysis}
              </pre>
            </div>
          </div>
        )}

        {/* Builds Tab */}
        {activeTab === 'builds' && (
          <div className="space-y-8">
            {/* Build Selector */}
            <div className="flex flex-wrap justify-center gap-3">
              {builds.map((build, i) => (
                <button
                  key={build.id}
                  onClick={() => setActiveBuild(i)}
                  className={`px-6 py-3 border font-mono text-sm tracking-wider transition-all ${
                    activeBuild === i 
                      ? 'border-orange-500 bg-orange-500 text-black font-bold' 
                      : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {build.weapon_name}
                  {i === 0 && <span className="ml-2 text-xs">[TOP]</span>}
                </button>
              ))}
            </div>

            {/* Active Build */}
            {builds[activeBuild] && (
              <div className="border border-orange-500/30 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                {/* Build Header */}
                <div className="p-8 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-b border-orange-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-orange-400 text-sm font-mono mb-1">{builds[activeBuild].category.toUpperCase().replace('_', ' ')}</p>
                      <h3 className="text-4xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                        {builds[activeBuild].weapon_name}
                      </h3>
                      <p className="text-amber-400 text-lg font-mono tracking-wider">{builds[activeBuild].build_name}</p>
                    </div>
                    {activeBuild === 0 && (
                      <div className="px-4 py-2 bg-orange-500 text-black font-bold text-sm font-mono">
                        TOP PICK
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400">{builds[activeBuild].description}</p>
                </div>

                {/* Stats */}
                <div className="p-8 border-b border-gray-800">
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    PERFORMANCE STATS
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: 'DANNO', value: builds[activeBuild].stats.damage },
                      { label: 'PRECISIONE', value: builds[activeBuild].stats.accuracy },
                      { label: 'RANGE', value: builds[activeBuild].stats.range },
                      { label: 'CADENZA', value: builds[activeBuild].stats.fire_rate },
                      { label: 'MOBILITÀ', value: builds[activeBuild].stats.mobility },
                      { label: 'CONTROLLO', value: builds[activeBuild].stats.control },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-4">
                        <span className="text-gray-500 text-xs font-mono w-24">{s.label}</span>
                        <div className="flex-1 h-4 bg-gray-800 relative">
                          <div className={`h-full ${getBarColor(s.value)}`} style={{ width: `${s.value}%` }} />
                        </div>
                        <span className={`text-lg font-bold font-mono w-10 text-right ${getBarColor(s.value).replace('bg-', 'text-')}`}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                <div className="p-8 border-b border-gray-800">
                  <h4 className="text-white font-bold mb-6">ATTACHMENTS</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {builds[activeBuild].attachments.map((att, i) => (
                      <div key={i} className="p-4 border-l-2 border-orange-500 bg-orange-500/5">
                        <p className="text-orange-400 text-xs font-mono mb-1">{att.slot}</p>
                        <p className="text-white font-bold">{att.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="p-8 grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5" /> PRO
                    </h4>
                    <ul className="space-y-2">
                      {builds[activeBuild].pros.map((p, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                      <X className="w-5 h-5" /> CONTRO
                    </h4>
                    <ul className="space-y-2">
                      {builds[activeBuild].cons.map((c, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="p-8 border border-amber-500/30 bg-amber-500/5">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3" style={{ fontFamily: 'Black Ops One, cursive' }}>
              <Lightbulb className="w-8 h-8 text-amber-500" />
              CONSIGLI TATTICI
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-gray-800 bg-[#111]">
                  <div className="w-10 h-10 border border-amber-500/50 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 font-bold font-mono">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
