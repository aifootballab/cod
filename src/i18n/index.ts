import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  it: {
    translation: {
      nav: {
        home: 'HOME',
        analyze: 'ANALIZZA',
        builds: 'BUILD',
        leaderboard: 'CLASSIFICA',
        profile: 'PROFILO',
        login: 'ACCEDI',
        logout: 'ESCI',
        signup: 'REGISTRATI',
      },
      hero: {
        title: 'COD COACHING',
        subtitle: 'OTTIMIZZATORE TATTICO LOADOUT',
        description: 'La piattaforma AI più avanzata per Call of Duty. Analizza le tue statistiche, ricevi build META personalizzate e domina il campo di battaglia.',
        cta: 'INIZIA ANALISI',
        features: {
          ocr: 'OCR AI',
          builds: 'BUILD META',
          analysis: 'ANALISI',
          ranking: 'CLASSIFICA',
          loadout: 'LOADOUT',
          rag: 'RAG SYSTEM',
        },
      },
      upload: {
        title: 'CARICA STATS',
        subtitle: 'Scatta uno screenshot della schermata statistiche di Call of Duty',
        dragDrop: 'TRASCINA SCREENSHOT',
        orClick: 'o clicca per selezionare',
        formats: 'PNG, JPG - Max 10MB',
        steps: {
          capture: { title: 'SCATTA', desc: 'Screenshot delle tue statistiche' },
          analyze: { title: 'ANALIZZA', desc: 'AI estrae K/D, accuracy, SPM' },
          optimize: { title: 'OTTIMIZZA', desc: 'Ricevi build personalizzate' },
        },
        stages: {
          upload: 'UPLOADING...',
          ocr: 'OCR ANALYSIS (GPT-4V)...',
          ai: 'AI ANALYZING STATS...',
          rag: 'RAG SEARCHING BUILDS...',
          save: 'SAVING RESULTS...',
          complete: 'COMPLETE!',
        },
      },
      results: {
        title: 'RISULTATI OPERATIVI',
        complete: 'ANALISI COMPLETATA',
        tabs: {
          stats: 'STATISTICHE',
          builds: 'LOADOUT',
          tips: 'TATTICHE',
          history: 'STORICO',
        },
        rank: {
          title: 'OPERATOR RANK',
          progress: 'RANK PROGRESS',
          playstyle: 'STILE DI GIOCO',
        },
        stats: {
          detailed: 'STATISTICHE DETTAGLIATE',
          kills: 'KILLS',
          deaths: 'DEATHS',
          headshot: 'HEADSHOT %',
          playtime: 'PLAY TIME',
          level: 'LEVEL',
          bestWeapon: 'BEST WEAPON',
        },
        aiAnalysis: 'ANALISI INTELLIGENZA ARTIFICIALE',
        builds: {
          performance: 'PERFORMANCE STATS',
          attachments: 'ATTACHMENTS',
          pros: 'PRO',
          cons: 'CONTRO',
          save: 'SALVA',
          share: 'CONDIVIDI',
          topPick: 'TOP PICK',
        },
        tips: {
          title: 'CONSIGLI TATTICI',
        },
        newAnalysis: 'NUOVA ANALISI',
      },
      leaderboard: {
        title: 'CLASSIFICA GLOBALE',
        subtitle: 'I migliori operatori del mondo',
        tabs: {
          global: 'GLOBALE',
          monthly: 'MENSILE',
          weekly: 'SETTIMANALE',
        },
        columns: {
          rank: 'RANK',
          player: 'GIOCATORE',
          kd: 'K/D',
          accuracy: 'ACCURACY',
          spm: 'SPM',
        },
      },
      profile: {
        title: 'PROFILO OPERATORE',
        stats: {
          title: 'STATISTICHE TOTALI',
          analyses: 'ANALISI',
          favoriteWeapon: 'ARMA PREFERITA',
          totalKills: 'KILLS TOTALI',
          timePlayed: 'TEMPO GIOCATO',
        },
        achievements: {
          title: 'ACHIEVEMENT',
          unlocked: 'SBLOCCATI',
        },
        history: {
          title: 'STORICO ANALISI',
          viewAll: 'VEDI TUTTO',
        },
      },
      builds: {
        title: 'DATABASE BUILD',
        subtitle: 'Tutte le loadout META per MW3',
        filters: {
          all: 'TUTTE',
          meta: 'META',
          assault: 'ASSAULT',
          smg: 'SMG',
          sniper: 'SNIPER',
        },
        details: {
          damage: 'DANNO',
          accuracy: 'PRECISIONE',
          range: 'RANGE',
          fireRate: 'CADENZA',
          mobility: 'MOBILITÀ',
          control: 'CONTROLLO',
        },
      },
      chat: {
        title: 'COACH AI',
        subtitle: 'Chiedi consigli al tuo coach personale',
        placeholder: 'Scrivi un messaggio...',
        suggestions: [
          'Come miglioro la mira?',
          'Quale SMG consigli?',
          'Perché perdo i gunfight?',
        ],
      },
      errors: {
        noApiKey: 'API key non configurata. Contatta l\'amministratore.',
        analysisFailed: 'Analisi fallita. Riprova con un\'immagine più chiara.',
        uploadFailed: 'Upload fallito. Riprova.',
        networkError: 'Errore di connessione. Controlla la tua rete.',
      },
      footer: {
        enterprise: 'ENTERPRISE EDITION',
        copyright: '© 2024 COD COACHING. NON AFFILIATO CON ACTIVISION.',
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'HOME',
        analyze: 'ANALYZE',
        builds: 'BUILDS',
        leaderboard: 'LEADERBOARD',
        profile: 'PROFILE',
        login: 'LOGIN',
        logout: 'LOGOUT',
        signup: 'SIGN UP',
      },
      hero: {
        title: 'COD COACHING',
        subtitle: 'TACTICAL LOADOUT OPTIMIZER',
        description: 'The most advanced AI platform for Call of Duty. Analyze your stats, get personalized META builds, and dominate the battlefield.',
        cta: 'START ANALYSIS',
        features: {
          ocr: 'AI OCR',
          builds: 'META BUILDS',
          analysis: 'ANALYSIS',
          ranking: 'RANKING',
          loadout: 'LOADOUT',
          rag: 'RAG SYSTEM',
        },
      },
      upload: {
        title: 'UPLOAD STATS',
        subtitle: 'Take a screenshot of your Call of Duty stats screen',
        dragDrop: 'DRAG SCREENSHOT',
        orClick: 'or click to select',
        formats: 'PNG, JPG - Max 10MB',
        steps: {
          capture: { title: 'CAPTURE', desc: 'Screenshot your stats' },
          analyze: { title: 'ANALYZE', desc: 'AI extracts K/D, accuracy, SPM' },
          optimize: { title: 'OPTIMIZE', desc: 'Get personalized builds' },
        },
        stages: {
          upload: 'UPLOADING...',
          ocr: 'OCR ANALYSIS (GPT-4V)...',
          ai: 'AI ANALYZING STATS...',
          rag: 'RAG SEARCHING BUILDS...',
          save: 'SAVING RESULTS...',
          complete: 'COMPLETE!',
        },
      },
      results: {
        title: 'OPERATIONAL RESULTS',
        complete: 'ANALYSIS COMPLETE',
        tabs: {
          stats: 'STATISTICS',
          builds: 'LOADOUT',
          tips: 'TACTICS',
          history: 'HISTORY',
        },
        rank: {
          title: 'OPERATOR RANK',
          progress: 'RANK PROGRESS',
          playstyle: 'PLAYSTYLE',
        },
        stats: {
          detailed: 'DETAILED STATISTICS',
          kills: 'KILLS',
          deaths: 'DEATHS',
          headshot: 'HEADSHOT %',
          playtime: 'PLAY TIME',
          level: 'LEVEL',
          bestWeapon: 'BEST WEAPON',
        },
        aiAnalysis: 'ARTIFICIAL INTELLIGENCE ANALYSIS',
        builds: {
          performance: 'PERFORMANCE STATS',
          attachments: 'ATTACHMENTS',
          pros: 'PROS',
          cons: 'CONS',
          save: 'SAVE',
          share: 'SHARE',
          topPick: 'TOP PICK',
        },
        tips: {
          title: 'TACTICAL TIPS',
        },
        newAnalysis: 'NEW ANALYSIS',
      },
      leaderboard: {
        title: 'GLOBAL LEADERBOARD',
        subtitle: 'The best operators in the world',
        tabs: {
          global: 'GLOBAL',
          monthly: 'MONTHLY',
          weekly: 'WEEKLY',
        },
        columns: {
          rank: 'RANK',
          player: 'PLAYER',
          kd: 'K/D',
          accuracy: 'ACCURACY',
          spm: 'SPM',
        },
      },
      profile: {
        title: 'OPERATOR PROFILE',
        stats: {
          title: 'TOTAL STATISTICS',
          analyses: 'ANALYSES',
          favoriteWeapon: 'FAVORITE WEAPON',
          totalKills: 'TOTAL KILLS',
          timePlayed: 'TIME PLAYED',
        },
        achievements: {
          title: 'ACHIEVEMENTS',
          unlocked: 'UNLOCKED',
        },
        history: {
          title: 'ANALYSIS HISTORY',
          viewAll: 'VIEW ALL',
        },
      },
      builds: {
        title: 'BUILD DATABASE',
        subtitle: 'All META loadouts for MW3',
        filters: {
          all: 'ALL',
          meta: 'META',
          assault: 'ASSAULT',
          smg: 'SMG',
          sniper: 'SNIPER',
        },
        details: {
          damage: 'DAMAGE',
          accuracy: 'ACCURACY',
          range: 'RANGE',
          fireRate: 'FIRE RATE',
          mobility: 'MOBILITY',
          control: 'CONTROL',
        },
      },
      chat: {
        title: 'AI COACH',
        subtitle: 'Ask your personal coach for advice',
        placeholder: 'Type a message...',
        suggestions: [
          'How do I improve my aim?',
          'Which SMG do you recommend?',
          'Why do I lose gunfights?',
        ],
      },
      errors: {
        noApiKey: 'API key not configured. Contact administrator.',
        analysisFailed: 'Analysis failed. Try with a clearer image.',
        uploadFailed: 'Upload failed. Please retry.',
        networkError: 'Network error. Check your connection.',
      },
      footer: {
        enterprise: 'ENTERPRISE EDITION',
        copyright: '© 2024 COD COACHING. NOT AFFILIATED WITH ACTIVISION.',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
