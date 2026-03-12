"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "T1", yield: 4000, target: 2400 },
  { name: "T2", yield: 3000, target: 1398 },
  { name: "T3", yield: 2000, target: 9800 },
  { name: "T4", yield: 2780, target: 3908 },
  { name: "T5", yield: 1890, target: 4800 },
  { name: "T6", yield: 2390, target: 3800 },
  { name: "T7", yield: 3490, target: 4300 },
];

export function OverviewChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d0ac7a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d0ac7a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}kg`}
            dx={-10}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="yield"
            name="Sản lượng thực tế"
            stroke="#16a34a"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorYield)"
          />
          <Area
            type="monotone"
            dataKey="target"
            name="Sản lượng mục tiêu"
            stroke="#d0ac7a"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTarget)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
