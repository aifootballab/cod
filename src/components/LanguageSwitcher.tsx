import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'it', name: 'IT', flag: '🇮🇹' },
  { code: 'en', name: 'EN', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'it' ? 'en' : 'it';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1 border border-gray-700 hover:border-orange-500 text-gray-400 hover:text-orange-500 transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs font-mono">
        {languages.find((l) => l.code === currentLang)?.flag}
      </span>
      <span className="text-xs font-mono">
        {languages.find((l) => l.code === currentLang)?.name}
      </span>
    </button>
  );
}
