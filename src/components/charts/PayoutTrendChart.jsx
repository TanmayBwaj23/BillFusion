import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency } from '../../lib/utils';

export function PayoutTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip 
          formatter={(value, name) => [
            name === 'amount' ? formatCurrency(value) : `${value} trips`,
            name === 'amount' ? 'Payout Amount' : 'Trip Count'
          ]}
          labelStyle={{ color: '#374151' }}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
        />
        <Bar 
          dataKey="trips" 
          fill="#3b82f6" 
          opacity={0.3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
