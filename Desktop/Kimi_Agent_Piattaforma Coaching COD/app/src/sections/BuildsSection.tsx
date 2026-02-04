import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Crosshair, Target, Zap, Shield, 
  ChevronDown, ChevronUp, Skull, X
} from 'lucide-react';
import { 
  ALL_WEAPONS, 
  type Weapon, 
  type WeaponCategory,
  WEAPON_STATS 
} from '@/data/weapons-mw3-full';

interface BuildsSectionProps {
  onSelectWeapon?: (weapon: Weapon) => void;
  onBack?: () => void;
}

const CATEGORY_FILTERS: { id: WeaponCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All', icon: Crosshair },
  { id: 'assault', label: 'AR', icon: Target },
  { id: 'smg', label: 'SMG', icon: Zap },
  { id: 'lmg', label: 'LMG', icon: Shield },
  { id: 'marksman', label: 'Marksman', icon: Target },
  { id: 'sniper', label: 'Sniper', icon: Crosshair },
  { id: 'shotgun', label: 'Shotgun', icon: Skull },
  { id: 'pistol', label: 'Pistol', icon: Target },
];

const TIER_COLORS = {
  S: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
  A: 'text-green-400 border-green-400 bg-green-400/10',
  B: 'text-blue-400 border-blue-400 bg-blue-400/10',
  C: 'text-gray-400 border-gray-400 bg-gray-400/10',
  D: 'text-red-400 border-red-400 bg-red-400/10',
  F: 'text-red-600 border-red-600 bg-red-600/10',
};

export function BuildsSection({ onSelectWeapon }: BuildsSectionProps) {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<string | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | 'all'>('all');
  const [expandedWeapon, setExpandedWeapon] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'tier' | 'ttk' | 'name'>('tier');

  // Filtra armi
  const filteredWeapons = useMemo(() => {
    let filtered = ALL_WEAPONS;

    // Filtro categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.category === selectedCategory);
    }

    // Filtro tier
    if (selectedTier !== 'all') {
      filtered = filtered.filter(w => w.tier === selectedTier);
    }

    // Filtro difficoltà
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(w => w.difficulty === selectedDifficulty);
    }

    // Filtro ricerca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query)
      );
    }

    // Ordinamento
    filtered.sort((a, b) => {
      if (sortBy === 'tier') {
        const tierOrder = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5 };
        return tierOrder[a.tier] - tierOrder[b.tier];
      }
      if (sortBy === 'ttk') {
        return a.ttk.close - b.ttk.close;
      }
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedTier, selectedDifficulty, sortBy]);

  const stats = {
    total: filteredWeapons.length,
    meta: filteredWeapons.filter(w => w.isMeta).length,
    sTier: filteredWeapons.filter(w => w.tier === 'S').length,
  };

  const getDifficultyLabel = (diff: string) => {
    const labels: Record<string, { it: string; en: string }> = {
      easy: { it: 'Facile', en: 'Easy' },
      medium: { it: 'Media', en: 'Medium' },
      hard: { it: 'Difficile', en: 'Hard' },
    };
    return i18n.language === 'it' ? labels[diff]?.it : labels[diff]?.en;
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            {i18n.language === 'it' ? 'ARSENALE ' : 'ARSENAL '}
            <span className="text-orange-500">MW3</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {i18n.language === 'it' 
              ? `Database completo con ${WEAPON_STATS.total} armi, stats reali e build consigliate`
              : `Complete database with ${WEAPON_STATS.total} weapons, real stats and recommended builds`
            }
          </p>
          
          {/* Stats rapide */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-black text-orange-500">{WEAPON_STATS.total}</p>
              <p className="text-xs text-gray-500 font-mono uppercase">{i18n.language === 'it' ? 'Armi' : 'Weapons'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-yellow-500">{WEAPON_STATS.metaCount}</p>
              <p className="text-xs text-gray-500 font-mono uppercase">META</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-500">{WEAPON_STATS.sTier}</p>
              <p className="text-xs text-gray-500 font-mono uppercase">S-TIER</p>
            </div>
          </div>
        </div>

        {/* Filtri */}
        <div className="bg-[#111] border border-gray-800 p-4 mb-8">
          {/* Barra ricerca */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={i18n.language === 'it' ? 'Cerca arma...' : 'Search weapon...'}
              className="w-full bg-black border border-gray-700 pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtri categorie */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as WeaponCategory | 'all')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-black border-orange-500'
                    : 'bg-black text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtri avanzati */}
          <div className="flex flex-wrap gap-4">
            {/* Tier filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">TIER:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-black border border-gray-700 text-white text-xs px-2 py-1 focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="S">S</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">
                {i18n.language === 'it' ? 'DIFF:' : 'DIFF:'}
              </span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-black border border-gray-700 text-white text-xs px-2 py-1 focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="easy">{getDifficultyLabel('easy')}</option>
                <option value="medium">{getDifficultyLabel('medium')}</option>
                <option value="hard">{getDifficultyLabel('hard')}</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">
                {i18n.language === 'it' ? 'ORDINA:' : 'SORT:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black border border-gray-700 text-white text-xs px-2 py-1 focus:border-orange-500 focus:outline-none"
              >
                <option value="tier">Tier</option>
                <option value="ttk">TTK</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Risultati filtro */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-mono">
              {i18n.language === 'it' 
                ? `Mostrando ${stats.total} armi (${stats.meta} META)`
                : `Showing ${stats.total} weapons (${stats.meta} META)`
              }
            </span>
            {(selectedCategory !== 'all' || selectedTier !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTier('all');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                }}
                className="text-xs text-orange-500 hover:text-orange-400 font-mono"
              >
                {i18n.language === 'it' ? 'Reset filtri' : 'Reset filters'}
              </button>
            )}
          </div>
        </div>

        {/* Griglia armi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWeapons.map((weapon) => (
            <div
              key={weapon.id}
              className={`border ${TIER_COLORS[weapon.tier]} p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                expandedWeapon === weapon.id ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''
              }`}
              onClick={() => setExpandedWeapon(expandedWeapon === weapon.id ? null : weapon.id)}
            >
              {/* Header arma */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                      {weapon.name}
                    </h3>
                    {weapon.isMeta && (
                      <span className="px-2 py-0.5 bg-orange-500 text-black text-xs font-bold">
                        META
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono uppercase">
                    {weapon.category} • {getDifficultyLabel(weapon.difficulty)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${TIER_COLORS[weapon.tier].split(' ')[0]}`}>
                    {weapon.tier}
                  </span>
                  <p className="text-xs text-gray-500 font-mono">TIER</p>
                </div>
              </div>

              {/* Stats rapide */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-black/50">
                  <p className="text-lg font-bold text-orange-400">{weapon.fireRateRPM}</p>
                  <p className="text-xs text-gray-500 font-mono">RPM</p>
                </div>
                <div className="text-center p-2 bg-black/50">
                  <p className="text-lg font-bold text-cyan-400">{weapon.ttk.close}ms</p>
                  <p className="text-xs text-gray-500 font-mono">TTK</p>
                </div>
                <div className="text-center p-2 bg-black/50">
                  <p className="text-lg font-bold text-green-400">{weapon.adsTime}ms</p>
                  <p className="text-xs text-gray-500 font-mono">ADS</p>
                </div>
              </div>

              {/* Descrizione */}
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {weapon.description}
              </p>

              {/* Best for */}
              <div className="flex flex-wrap gap-1 mb-3">
                {weapon.bestFor.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Expand icon */}
              <div className="flex justify-center">
                {expandedWeapon === weapon.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Dettagli espansi */}
              {expandedWeapon === weapon.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  {/* Stats dettagliate */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-mono uppercase">{i18n.language === 'it' ? 'Danno' : 'Damage'}</p>
                      <p className="text-white font-mono">Chest: {weapon.damage.chest}</p>
                      <p className="text-gray-400 text-xs font-mono">Head: {weapon.damage.head}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono uppercase">{i18n.language === 'it' ? 'Range' : 'Range'}</p>
                      <p className="text-white font-mono">{weapon.range.damageDropStart}m - {weapon.range.damageDropEnd}m</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono uppercase">{i18n.language === 'it' ? 'Rinculo' : 'Recoil'}</p>
                      <p className="text-white font-mono">V: {weapon.recoilVertical}/10</p>
                      <p className="text-gray-400 text-xs font-mono">H: {weapon.recoilHorizontal}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono uppercase">{i18n.language === 'it' ? 'Mobilità' : 'Mobility'}</p>
                      <p className="text-white font-mono">Sprint: {weapon.sprintToFire}ms</p>
                      <p className="text-gray-400 text-xs font-mono">Reload: {weapon.reloadTime}s</p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {weapon.metaAttachments && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-mono uppercase mb-2">
                        {i18n.language === 'it' ? 'Attachments Consigliati' : 'Recommended Attachments'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {weapon.metaAttachments.map((att, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30">
                            {att}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modalità consigliate */}
                  <div className="flex gap-2 mb-4">
                    {weapon.recommendedModes.map(mode => (
                      <span key={mode} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs border border-green-500/30 uppercase">
                        {mode}
                      </span>
                    ))}
                  </div>

                  {/* Azione */}
                  {onSelectWeapon && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWeapon(weapon);
                      }}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold font-mono text-sm transition-colors"
                    >
                      {i18n.language === 'it' ? 'SELEZIONA ARMA' : 'SELECT WEAPON'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredWeapons.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {i18n.language === 'it' ? 'Nessuna arma trovata' : 'No weapons found'}
            </h3>
            <p className="text-gray-500">
              {i18n.language === 'it' 
                ? 'Prova a modificare i filtri di ricerca'
                : 'Try adjusting your search filters'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
