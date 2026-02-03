import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, Target, TrendingUp, Zap, Crosshair, 
  ChevronRight, Star, Shield, Flame, Play, Lock, User 
} from 'lucide-react';

interface DemoSectionProps {
  onStartTrial?: () => void;
}

// Dati simulati realistici
const mockAnalysis = {
  player: {
    username: 'ShadowOps_94',
    rank: 'ELITE',
    level: 145,
    kd_ratio: 1.34,
    accuracy: 28,
    spm: 385,
    win_rate: 62,
    total_kills: 45230,
    play_time: '420H',
    best_weapon: 'STRIKER 9',
    headshot_pct: 24,
  },
  history: [
    { date: '15/01', kd: 0.85, acc: 18, spm: 245 },
    { date: '22/01', kd: 0.92, acc: 20, spm: 268 },
    { date: '01/02', kd: 1.05, acc: 22, spm: 295 },
    { date: '10/02', kd: 1.12, acc: 24, spm: 320 },
    { date: '17/02', kd: 1.34, acc: 28, spm: 385 },
  ],
  recommendations: [
    { 
      type: 'weapon', 
      title: 'STRIKER 9 - Build META', 
      desc: 'La tua accuracy suggerisce SMG a corto raggio',
      stats: { dmg: 75, acc: 82, range: 45, mob: 90 }
    },
    { 
      type: 'tactic', 
      title: 'Posizionamento aggressivo', 
      desc: 'Il tuo SPM è alto, sfrutta spawns push',
      icon: Flame 
    },
    { 
      type: 'improvement', 
      title: 'Mira alla testa', 
      desc: 'Headshot 24% → punta a 30%+ per TTK migliore',
      icon: Target 
    },
  ],
  achievements: [
    { name: 'First Blood', unlocked: true, icon: '🎯' },
    { name: 'Positive K/D', unlocked: true, icon: '📈' },
    { name: 'Sharpshooter', unlocked: false, progress: 24, target: 30, icon: '🎯' },
    { name: 'Legend', unlocked: false, progress: 320, target: 400, icon: '👑' },
  ]
};

export function DemoSection({ onStartTrial }: DemoSectionProps) {
  useTranslation();
  const [activeTab, setActiveTab] = useState<'stats' | 'builds' | 'progress'>('stats');

  return (
    <section className="py-16 px-4 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono tracking-wider mb-4">
            <Play className="w-4 h-4" />
            DEMO INTERATTIVA
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            COME FUNZIONA <span className="text-orange-500">L&apos;ANALISI</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Questo è un esempio di cosa vedrai dopo aver caricato le tue statistiche. 
            I dati sono simulati per mostrarti il potenziale.
          </p>
        </div>

        {/* Demo Dashboard */}
        <div className="border border-gray-800 bg-[#0f0f0f] rounded-sm overflow-hidden">
          {/* Demo Warning Bar */}
          <div className="bg-orange-500/10 border-b border-orange-500/30 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-mono">
              <Lock className="w-3 h-3" />
              MODALITÀ DEMO - Dati simulati
            </div>
            <button 
              onClick={onStartTrial}
              className="text-xs font-mono text-orange-400 hover:text-orange-300 underline"
            >
              Prova con i tuoi dati reali →
            </button>
          </div>

          {/* Player Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-orange-500 bg-orange-500/20 flex items-center justify-center relative">
                  <User className="w-8 h-8 text-orange-500" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
                    {mockAnalysis.player.level}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                      {mockAnalysis.player.username}
                    </h3>
                    <span className="px-2 py-0.5 bg-orange-500 text-black text-xs font-bold">
                      {mockAnalysis.player.rank}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-mono">
                    Livello {mockAnalysis.player.level} • {mockAnalysis.player.play_time} giocati
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                {[
                  { label: 'K/D', value: mockAnalysis.player.kd_ratio, color: 'text-orange-400' },
                  { label: 'ACCURACY', value: `${mockAnalysis.player.accuracy}%`, color: 'text-cyan-400' },
                  { label: 'SPM', value: mockAnalysis.player.spm, color: 'text-green-400' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center px-4 border-l border-gray-800 first:border-l-0">
                    <p className={`text-2xl font-black ${stat.color}`} style={{ fontFamily: 'Black Ops One, cursive' }}>
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-xs font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {[
              { id: 'stats', label: 'STATISTICHE', icon: Trophy },
              { id: 'builds', label: 'BUILD CONSIGLIATE', icon: Crosshair },
              { id: 'progress', label: 'PROGRESSO', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-black font-bold'
                    : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'stats' && (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Main Stats Cards */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Trophy, label: 'Analisi Completate', value: '12', color: 'text-yellow-500' },
                      { icon: Target, label: 'Arma Preferita', value: mockAnalysis.player.best_weapon, color: 'text-orange-500' },
                      { icon: Flame, label: 'Kills Totali', value: mockAnalysis.player.total_kills.toLocaleString(), color: 'text-red-500' },
                      { icon: Shield, label: 'Win Rate', value: `${mockAnalysis.player.win_rate}%`, color: 'text-blue-500' },
                    ].map((stat, i) => (
                      <div key={i} className="p-4 border border-gray-800 bg-black/40">
                        <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                        <p className="text-gray-500 text-xs font-mono uppercase">{stat.label}</p>
                        <p className="text-xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* AI Analysis Box */}
                  <div className="p-4 border border-orange-500/30 bg-orange-500/5">
                    <h4 className="flex items-center gap-2 text-orange-400 font-bold mb-2">
                      <Zap className="w-4 h-4" />
                      ANALISI AI
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Il tuo stile di gioco è <span className="text-orange-400 font-bold">AGGRESSIVO</span>. 
                      Hai un SPM alto ({mockAnalysis.player.spm}) ma potresti migliorare l&apos;accuracy. 
                      Ti consigliamo build SMG per rushare e mappe piccole.
                    </p>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="p-4 border border-gray-800 bg-black/40">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    ANDAMENTO K/D
                  </h4>
                  <div className="space-y-2">
                    {mockAnalysis.history.map((h, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs font-mono w-12">{h.date}</span>
                        <div className="flex-1 h-8 bg-gray-800/50 relative overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all"
                            style={{ width: `${(h.kd / 2) * 100}%` }}
                          />
                        </div>
                        <span className="text-orange-400 font-mono text-sm w-12 text-right">{h.kd}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Trend</span>
                      <span className="text-green-400 font-mono">+57% ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'builds' && (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm mb-4">
                  Basandoci sulle tue statistiche, queste sono le build ottimali per te:
                </p>
                {mockAnalysis.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 border border-gray-800 hover:border-orange-500/50 transition-colors bg-black/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-mono px-2 py-0.5 ${
                            rec.type === 'weapon' ? 'bg-orange-500/20 text-orange-400' :
                            rec.type === 'tactic' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {rec.type.toUpperCase()}
                          </span>
                          <h4 className="text-white font-bold">{rec.title}</h4>
                        </div>
                        <p className="text-gray-400 text-sm">{rec.desc}</p>
                      </div>
                      {rec.type === 'weapon' && rec.stats && (
                        <div className="flex gap-2">
                          {Object.entries(rec.stats).map(([k, v]) => (
                            <div key={k} className="text-center">
                              <div className="w-12 h-1 bg-gray-800 mb-1">
                                <div 
                                  className="h-full bg-orange-500" 
                                  style={{ width: `${v}%` }}
                                />
                              </div>
                              <span className="text-gray-500 text-xs font-mono uppercase">{k}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Achievements */}
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    ACHIEVEMENTS
                  </h4>
                  <div className="space-y-2">
                    {mockAnalysis.achievements.map((ach, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-3 border ${
                          ach.unlocked ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ach.icon}</span>
                          <div>
                            <p className={`text-sm font-medium ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>
                              {ach.name}
                            </p>
                            {!ach.unlocked && ach.progress && (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-24 h-1 bg-gray-800">
                                  <div 
                                    className="h-full bg-orange-500" 
                                    style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{ach.progress}/{ach.target}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {ach.unlocked && (
                          <span className="text-green-500 text-xs font-mono">SBLOCCATO ✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 border border-orange-500/30 bg-orange-500/5 flex flex-col justify-center items-center text-center">
                  <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
                    VUOI I TUOI DATI?
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Registrati gratis e scopri le tue statistiche reali con analisi AI personalizzata.
                  </p>
                  <button
                    onClick={onStartTrial}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold font-mono tracking-wider transition-colors"
                  >
                    INIZIA ORA
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Questa è solo una simulazione. I dati reali sono molto più dettagliati.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Analisi AI in 30 secondi
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Build META personalizzate
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Storico progressi
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
