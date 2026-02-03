import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatAIProps {
  playerStats?: {
    kd_ratio: number;
    accuracy: number;
    spm: number;
    best_weapon: string;
  };
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export function ChatAI({ playerStats }: ChatAIProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: playerStats
        ? `Ciao! Sono il tuo coach AI. Vedo che hai un K/D di ${playerStats.kd_ratio} e accuracy del ${playerStats.accuracy}%. Come posso aiutarti a migliorare oggi?`
        : 'Ciao! Sono il tuo coach AI per Call of Duty. Come posso aiutarti oggi?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // If no API key, use fallback responses
    if (!OPENAI_API_KEY) {
      setTimeout(() => {
        const fallbackResponses = [
          'Per migliorare la tua accuracy, prova ad abbassare la sensibilità del 10-15% e allenati in Shoot House contro bot.',
          'Con il tuo stile di gioco, ti consiglio di usare SMG come lo Striker o il Superi 46.',
          'Se perdi spesso i gunfight, potrebbe essere un problema di posizionamento. Prova a usare più cover.',
          'Per salire di rank, concentrati prima su un singolo obiettivo: migliora K/D, poi accuracy, poi SPM.',
        ];
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Real OpenAI API call
    try {
      const systemPrompt = `Sei un coach esperto di Call of Duty. Dai consigli concetti e pratici.
${playerStats ? `Il giocatore ha: K/D ${playerStats.kd_ratio}, Accuracy ${playerStats.accuracy}%, SPM ${playerStats.spm}, Best Weapon: ${playerStats.best_weapon}` : ''}
Rispondi in italiano, max 2-3 frasi.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: input },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const assistantContent = data.choices[0]?.message?.content || 'Non ho capito. Puoi ripetere?';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Mi dispiace, ho avuto un problema. Riprova tra poco.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = t('chat.suggestions', { returnObjects: true }) as string[];

  return (
    <div className="w-full h-[500px] flex flex-col border border-gray-800 bg-[#111]">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 border border-orange-500/50 bg-orange-500/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-white font-bold">{t('chat.title')}</h3>
          <p className="text-gray-500 text-xs">{t('chat.subtitle')}</p>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-orange-500 text-black'
                  : 'border border-orange-500/50 bg-orange-500/10'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4 text-orange-500" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 ${
                message.role === 'user'
                  ? 'bg-orange-500 text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 border border-orange-500/50 bg-orange-500/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <div className="bg-gray-800 p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-gray-800 flex flex-wrap gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(suggestion);
              }}
              className="px-3 py-1 text-xs border border-gray-700 text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chat.placeholder')}
          className="flex-1 bg-gray-900 border border-gray-700 px-4 py-2 text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-orange-500 text-black hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
