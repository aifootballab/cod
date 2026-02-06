import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">COD Coaching</h1>
        <p className="text-gray-400 mb-6">Piattaforma in manutenzione</p>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-6 py-3 bg-orange-600 rounded-lg font-bold"
        >
          Click: {count}
        </button>
      </div>
    </div>
  );
}
