import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,

  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface AnalysisHistory {
  id: string;
  created_at: string;
  kd_ratio: number;
  accuracy: number;
  spm: number;
  win_rate: number;
}

interface StatsChartProps {
  history: AnalysisHistory[];
  type?: 'kd' | 'accuracy' | 'spm' | 'combined';
}

export function StatsChart({ history, type = 'combined' }: StatsChartProps) {
  useTranslation(); // hook present but unused for now

  const data = useMemo(() => {
    return history.map((h) => ({
      date: new Date(h.created_at).toLocaleDateString(),
      kd: h.kd_ratio,
      accuracy: h.accuracy,
      spm: h.spm,
      winRate: h.win_rate,
    }));
  }, [history]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] border border-orange-500/50 p-3">
          <p className="text-gray-400 text-xs font-mono mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-mono" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'kd') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="kdGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" fontSize={10} fontFamily="monospace" />
          <YAxis stroke="#666" fontSize={10} fontFamily="monospace" domain={[0, 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="kd"
            name="K/D"
            stroke="#ff6b00"
            strokeWidth={2}
            fill="url(#kdGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'accuracy') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" fontSize={10} fontFamily="monospace" />
          <YAxis stroke="#666" fontSize={10} fontFamily="monospace" domain={[0, 50]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="accuracy"
            name="Accuracy %"
            stroke="#00f0ff"
            strokeWidth={2}
            fill="url(#accGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'spm') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" fontSize={10} fontFamily="monospace" />
          <YAxis stroke="#666" fontSize={10} fontFamily="monospace" domain={[0, 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="spm"
            name="SPM"
            stroke="#39ff14"
            strokeWidth={2}
            fill="url(#spmGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Combined chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#666" fontSize={10} fontFamily="monospace" />
        <YAxis yAxisId="left" stroke="#666" fontSize={10} fontFamily="monospace" />
        <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={10} fontFamily="monospace" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="kd"
          name="K/D"
          stroke="#ff6b00"
          strokeWidth={2}
          dot={{ fill: '#ff6b00', strokeWidth: 0, r: 3 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="accuracy"
          name="Accuracy %"
          stroke="#00f0ff"
          strokeWidth={2}
          dot={{ fill: '#00f0ff', strokeWidth: 0, r: 3 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="spm"
          name="SPM"
          stroke="#39ff14"
          strokeWidth={2}
          dot={{ fill: '#39ff14', strokeWidth: 0, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
