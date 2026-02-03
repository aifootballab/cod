import { useState, useRef } from 'react';
import { 
  User, Settings, CreditCard, History, Award, Camera, 
  Zap, Shield, Crown, Star, TrendingUp, Package, 
  CheckCircle, AlertCircle, ChevronRight, Wallet
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ProfileSettingsProps {
  user: SupabaseUser | null;
}

// Mock data per crediti e transazioni
const MOCK_CREDITS = 2450;
const MOCK_TRANSACTIONS = [
  { id: '1', type: 'purchase', amount: 1000, cost: 9.99, date: '2024-02-01', status: 'completed' },
  { id: '2', type: 'usage', amount: -50, description: 'Analysis #1234', date: '2024-02-02', status: 'completed' },
  { id: '3', type: 'usage', amount: -50, description: 'Analysis #1235', date: '2024-02-03', status: 'completed' },
  { id: '4', type: 'bonus', amount: 500, description: 'Welcome Bonus', date: '2024-02-03', status: 'completed' },
  { id: '5', type: 'purchase', amount: 2000, cost: 19.99, date: '2024-02-05', status: 'completed' },
];

// Package crediti disponibili
const CREDIT_PACKAGES = [
  { id: 'starter', name: 'STARTER', credits: 500, price: 4.99, popular: false, color: 'from-gray-600 to-gray-700' },
  { id: 'pro', name: 'PRO', credits: 1500, price: 12.99, popular: true, color: 'from-orange-600 to-amber-600' },
  { id: 'elite', name: 'ELITE', credits: 5000, price: 39.99, popular: false, color: 'from-purple-600 to-pink-600' },
  { id: 'legend', name: 'LEGEND', credits: 15000, price: 99.99, popular: false, color: 'from-cyan-600 to-blue-600' },
];

// Avatar disponibili
const AVATARS = [
  { id: 'default', name: 'Operative', icon: User, color: 'text-gray-400', bg: 'bg-gray-800', unlocked: true },
  { id: 'soldier', name: 'Soldier', icon: Shield, color: 'text-green-400', bg: 'bg-green-900/30', unlocked: true },
  { id: 'elite', name: 'Elite', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-900/30', unlocked: MOCK_CREDITS >= 1000 },
  { id: 'commander', name: 'Commander', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-900/30', unlocked: MOCK_CREDITS >= 2000 },
  { id: 'legend', name: 'Legend', icon: Award, color: 'text-cyan-400', bg: 'bg-cyan-900/30', unlocked: MOCK_CREDITS >= 5000 },
  { id: 'titan', name: 'Titan', icon: Zap, color: 'text-red-400', bg: 'bg-red-900/30', unlocked: MOCK_CREDITS >= 10000 },
];

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'avatar' | 'billing'>('overview');
  const [selectedAvatar, setSelectedAvatar] = useState('default');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-black text-white mb-2">Accesso Richiesto</h2>
          <p className="text-gray-500">Accedi per gestire il tuo profilo enterprise</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header Enterprise */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-orange-500" />
            <span className="text-orange-500 text-sm font-mono tracking-widest">ENTERPRISE DASHBOARD</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
            GESTIONE <span className="text-orange-500">PROFILO</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="border border-gray-800 bg-[#111] p-4 sticky top-24">
              {/* User Card Mini */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
                <div className="w-12 h-12 border-2 border-orange-500 bg-orange-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-white font-bold truncate">{user.email?.split('@')[0]}</p>
                  <p className="text-gray-500 text-xs font-mono truncate">{user.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'credits', label: 'Hero Points', icon: Wallet, badge: MOCK_CREDITS },
                  { id: 'avatar', label: 'Avatar', icon: Camera },
                  { id: 'billing', label: 'Fatturazione', icon: CreditCard },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      activeTab === item.id
                        ? 'bg-orange-500/10 border-l-2 border-orange-500 text-orange-400'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-mono text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Credit Status Card */}
              <div className="mt-6 p-4 bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                <p className="text-gray-400 text-xs font-mono mb-1">CREDITI RESIDUI</p>
                <p className="text-3xl font-black text-orange-400" style={{ fontFamily: 'Black Ops One, cursive' }}>
                  {MOCK_CREDITS.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs mt-1">Hero Points</p>
                <button 
                  onClick={() => setActiveTab('credits')}
                  className="w-full mt-3 py-2 bg-orange-500 text-black font-bold text-sm font-mono hover:bg-orange-400 transition-colors"
                >
                  ACQUISTA
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Analisi Totali', value: '47', icon: TrendingUp, color: 'text-orange-400' },
                    { label: 'Hero Points', value: MOCK_CREDITS.toLocaleString(), icon: Wallet, color: 'text-yellow-400' },
                    { label: 'Rank Attuale', value: 'PLATINUM', icon: Award, color: 'text-cyan-400' },
                    { label: 'Membro Dal', value: '2024', icon: Crown, color: 'text-purple-400' },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 border border-gray-800 bg-[#111]">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                      <p className="text-gray-500 text-xs font-mono">{stat.label}</p>
                      <p className="text-xl font-bold text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="border border-gray-800 bg-[#111] p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-orange-500" />
                    ATTIVITÀ RECENTE
                  </h3>
                  <div className="space-y-3">
                    {MOCK_TRANSACTIONS.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center ${
                            tx.type === 'purchase' ? 'bg-green-500/20 text-green-400' :
                            tx.type === 'usage' ? 'bg-red-500/20 text-red-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {tx.type === 'purchase' ? <Package className="w-4 h-4" /> :
                             tx.type === 'usage' ? <Zap className="w-4 h-4" /> :
                             <Award className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {tx.type === 'purchase' ? 'Acquisto Crediti' :
                               tx.type === 'usage' ? tx.description :
                               'Bonus'}
                            </p>
                            <p className="text-gray-500 text-xs font-mono">{tx.date}</p>
                          </div>
                        </div>
                        <span className={`font-mono font-bold ${
                          tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} HP
                        </span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className="w-full mt-4 py-3 border border-gray-700 text-gray-400 font-mono text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    VEDI TUTTE LE TRANSAZIONI
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 border border-gray-800 bg-[#111] hover:border-orange-500/50 transition-colors cursor-pointer"
                       onClick={() => setActiveTab('credits')}>
                    <div className="flex items-center justify-between mb-4">
                      <Wallet className="w-8 h-8 text-orange-500" />
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="text-white font-bold mb-1">Acquista Crediti</h4>
                    <p className="text-gray-500 text-sm">Ottieni Hero Points per le analisi</p>
                  </div>
                  
                  <div className="p-6 border border-gray-800 bg-[#111] hover:border-orange-500/50 transition-colors cursor-pointer"
                       onClick={() => setActiveTab('avatar')}>
                    <div className="flex items-center justify-between mb-4">
                      <Camera className="w-8 h-8 text-cyan-500" />
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="text-white font-bold mb-1">Personalizza Avatar</h4>
                    <p className="text-gray-500 text-sm">Sblocca avatar esclusivi</p>
                  </div>
                </div>
              </div>
            )}

            {/* CREDITS TAB - SHOP */}
            {activeTab === 'credits' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
                    ACQUISTA <span className="text-orange-500">HERO POINTS</span>
                  </h2>
                  <p className="text-gray-500">Ottieni crediti per sbloccare analisi avanzate e avatar esclusivi</p>
                </div>

                {/* Current Balance */}
                <div className="p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 text-center">
                  <p className="text-gray-400 text-sm font-mono mb-2">SALDO ATTUALE</p>
                  <p className="text-5xl font-black text-orange-400" style={{ fontFamily: 'Black Ops One, cursive' }}>
                    {MOCK_CREDITS.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Hero Points disponibili</p>
                </div>

                {/* Packages Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CREDIT_PACKAGES.map((pkg) => (
                    <div key={pkg.id} className={`relative border-2 ${pkg.popular ? 'border-orange-500' : 'border-gray-800'} bg-[#111] p-6 flex flex-col`}>
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-black text-xs font-bold font-mono">
                          POPOLARE
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4`}>
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: 'Black Ops One, cursive' }}>
                        {pkg.name}
                      </h3>
                      <p className="text-3xl font-bold text-orange-400 mb-4">
                        {pkg.credits.toLocaleString()}
                        <span className="text-sm text-gray-500 block font-normal">Hero Points</span>
                      </p>
                      
                      <div className="mt-auto">
                        <p className="text-2xl font-bold text-white mb-4">€{pkg.price}</p>
                        <button className={`w-full py-3 font-bold font-mono transition-colors ${
                          pkg.popular 
                            ? 'bg-orange-500 text-black hover:bg-orange-400' 
                            : 'border border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-500'
                        }`}>
                          ACQUISTA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="p-4 border border-gray-800 bg-[#111] flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 text-sm">
                      <strong className="text-white">Come funziona:</strong> Ogni analisi completa consuma 50 Hero Points. 
                      I crediti non hanno scadenza e possono essere utilizzati in qualsiasi momento.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AVATAR TAB */}
            {activeTab === 'avatar' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
                    SELEZIONA <span className="text-orange-500">AVATAR</span>
                  </h2>
                  <p className="text-gray-500">Personalizza il tuo profilo con avatar esclusivi sbloccabili</p>
                </div>

                {/* Current Avatar Display */}
                <div className="p-8 border border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-transparent text-center">
                  <p className="text-gray-400 text-sm font-mono mb-4">AVATAR ATTUALE</p>
                  {(() => {
                    const avatar = AVATARS.find(a => a.id === selectedAvatar);
                    if (!avatar) return null;
                    return (
                      <div className="flex flex-col items-center">
                        <div className={`w-24 h-24 ${avatar.bg} border-2 border-orange-500 flex items-center justify-center mb-4`}>
                          <avatar.icon className={`w-12 h-12 ${avatar.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                          {avatar.name}
                        </h3>
                        <p className="text-orange-400 text-sm font-mono mt-1">
                          {avatar.unlocked ? 'Sbloccato' : 'Bloccato'}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => avatar.unlocked && setSelectedAvatar(avatar.id)}
                      disabled={!avatar.unlocked}
                      className={`relative p-6 border-2 transition-all ${
                        selectedAvatar === avatar.id
                          ? 'border-orange-500 bg-orange-500/10'
                          : avatar.unlocked
                            ? 'border-gray-700 bg-[#111] hover:border-gray-500'
                            : 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-16 h-16 ${avatar.bg} border border-gray-700 flex items-center justify-center mx-auto mb-3`}>
                        <avatar.icon className={`w-8 h-8 ${avatar.color}`} />
                      </div>
                      <p className="text-white font-bold text-sm">{avatar.name}</p>
                      {!avatar.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <div className="text-center">
                            <Lock className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                            <p className="text-gray-500 text-xs font-mono">Richiede HP</p>
                          </div>
                        </div>
                      )}
                      {selectedAvatar === avatar.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Upload Custom */}
                <div className="p-6 border border-dashed border-gray-700 bg-[#111] text-center">
                  <Camera className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Carica Avatar Personalizzato</h4>
                  <p className="text-gray-500 text-sm mb-4">Disponibile solo per account Elite+</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={() => setIsUploading(true)}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={MOCK_CREDITS < 5000}
                    className="px-6 py-2 border border-gray-600 text-gray-400 font-mono text-sm hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {MOCK_CREDITS < 5000 ? 'Richiede 5000 HP' : 'SELEZIONA FILE'}
                  </button>
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
                    STORICO <span className="text-orange-500">TRANSAZIONI</span>
                  </h2>
                  <p className="text-gray-500">Visualizza tutti i movimenti dei tuoi Hero Points</p>
                </div>

                {/* Transaction List */}
                <div className="border border-gray-800 bg-[#111]">
                  <div className="p-4 border-b border-gray-800 bg-[#0a0a0a]">
                    <div className="grid grid-cols-4 text-xs font-mono text-gray-500">
                      <span>TIPO</span>
                      <span>DETTAGLIO</span>
                      <span>DATA</span>
                      <span className="text-right">IMPORTO</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <div key={tx.id} className="p-4 hover:bg-[#0a0a0a] transition-colors">
                        <div className="grid grid-cols-4 items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 flex items-center justify-center ${
                              tx.type === 'purchase' ? 'bg-green-500/20 text-green-400' :
                              tx.type === 'usage' ? 'bg-red-500/20 text-red-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {tx.type === 'purchase' ? <Package className="w-4 h-4" /> :
                               tx.type === 'usage' ? <Zap className="w-4 h-4" /> :
                               <Award className="w-4 h-4" />}
                            </div>
                            <span className="text-white text-sm capitalize hidden sm:block">{tx.type}</span>
                          </div>
                          <span className="text-gray-400 text-sm truncate">
                            {tx.description || 'Acquisto Crediti'}
                          </span>
                          <span className="text-gray-500 text-sm font-mono">{tx.date}</span>
                          <span className={`text-right font-mono font-bold ${
                            tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} HP
                          </span>
                        </div>
                        {tx.cost && (
                          <div className="mt-2 text-right text-xs text-gray-600 font-mono">
                            Costo: €{tx.cost}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Report */}
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-400 font-mono text-sm hover:border-orange-500 hover:text-orange-500 transition-colors">
                    <History className="w-4 h-4" />
                    SCARICA REPORT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
