import { useState } from 'react';
import { Check, X, AlertTriangle, ChevronRight, BarChart3, Search } from 'lucide-react';
import type { WeaponBuild } from '@/types';

interface BuildsSectionProps {
  builds: WeaponBuild[];
}

const getBarColor = (v: number) => v < 50 ? 'bg-red-500' : v < 70 ? 'bg-amber-500' : v < 85 ? 'bg-emerald-500' : 'bg-cyan-500';

export function BuildsSection({ builds }: BuildsSectionProps) {
  const [activeBuild, setActiveBuild] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('all');

  const filteredBuilds = builds.filter(b => {
    const matchesSearch = b.weapon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.build_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || b.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'TUTTE' },
    { id: 'assault_rifle', label: 'AR' },
    { id: 'smg', label: 'SMG' },
    { id: 'lmg', label: 'LMG' },
    { id: 'sniper', label: 'SNIPER' },
    { id: 'shotgun', label: 'SHOTGUN' },
    { id: 'marksman', label: 'MARKSMAN' },
  ];

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            ARSENAL <span className="text-orange-500">TATTICO</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Database delle build META ottimizzate per ogni stile di gioco
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Cerca arma o build..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#111] border border-gray-800 text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 border text-sm font-mono tracking-wider transition-all ${
                  category === cat.id
                    ? 'border-orange-500 bg-orange-500 text-black'
                    : 'border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Build Selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filteredBuilds.map((build, i) => (
            <button
              key={build.id}
              onClick={() => setActiveBuild(i)}
              className={`px-4 py-2 border text-sm font-mono tracking-wider transition-all ${
                activeBuild === i && filteredBuilds[activeBuild]?.id === build.id
                  ? 'border-orange-500 bg-orange-500 text-black'
                  : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600'
              }`}
            >
              {build.weapon_name}
              {build.is_meta && <span className="ml-2 text-xs">[META]</span>}
            </button>
          ))}
        </div>

        {/* Active Build */}
        {filteredBuilds[activeBuild] && (
          <div className="border border-orange-500/30 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
            {/* Build Header */}
            <div className="p-8 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-b border-orange-500/30">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                <div>
                  <p className="text-orange-400 text-sm font-mono mb-1">
                    {filteredBuilds[activeBuild].category.toUpperCase().replace('_', ' ')}
                  </p>
                  <h3 className="text-4xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                    {filteredBuilds[activeBuild].weapon_name}
                  </h3>
                  <p className="text-amber-400 text-lg font-mono tracking-wider">
                    {filteredBuilds[activeBuild].build_name}
                  </p>
                </div>
                <div className="flex gap-2">
                  {filteredBuilds[activeBuild].is_meta && (
                    <div className="px-4 py-2 bg-orange-500 text-black font-bold text-sm font-mono">
                      META
                    </div>
                  )}
                  <div className={`px-4 py-2 border text-sm font-mono ${
                    filteredBuilds[activeBuild].difficulty === 'easy' ? 'border-emerald-500 text-emerald-400' :
                    filteredBuilds[activeBuild].difficulty === 'medium' ? 'border-amber-500 text-amber-400' :
                    'border-red-500 text-red-400'
                  }`}>
                    {filteredBuilds[activeBuild].difficulty.toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">{filteredBuilds[activeBuild].description}</p>
            </div>

            {/* Stats */}
            <div className="p-8 border-b border-gray-800">
              <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                PERFORMANCE STATS
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'DANNO', value: filteredBuilds[activeBuild].stats.damage },
                  { label: 'PRECISIONE', value: filteredBuilds[activeBuild].stats.accuracy },
                  { label: 'RANGE', value: filteredBuilds[activeBuild].stats.range },
                  { label: 'CADENZA', value: filteredBuilds[activeBuild].stats.fire_rate },
                  { label: 'MOBILITÀ', value: filteredBuilds[activeBuild].stats.mobility },
                  { label: 'CONTROLLO', value: filteredBuilds[activeBuild].stats.control },
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
                {filteredBuilds[activeBuild].attachments.map((att, i) => (
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
                  {filteredBuilds[activeBuild].pros.map((p, i) => (
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
                  {filteredBuilds[activeBuild].cons.map((c, i) => (
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
    </section>
  );
}
