'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toCurrency } from '@/lib/utils'

// A custom tooltip to show both metrics
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenuePayload = payload.find(p => p.dataKey === 'revenue');
    const ratePayload = payload.find(p => p.dataKey === 'avgDailyRate');

    return (
      <div className="p-2 bg-content1 border border-default-200 rounded-lg shadow-lg">
        <p className="label text-sm font-bold">{`${label}`}</p>
        {revenuePayload && <p className="intro text-sm text-primary">{`Revenue : ${toCurrency(revenuePayload.value)}`}</p>}
        {ratePayload && <p className="intro text-sm" style={{color: 'hsl(var(--nextui-secondary))'}}>{`Avg Rate : ${toCurrency(ratePayload.value)}`}</p>}
      </div>
    );
  }
  return null;
};

export default function MonthlyRevenueChart({ revenueData, priceHistoryData }) {
  // Calculate average daily rate per month from the price history
  const monthlyRates = (priceHistoryData || []).reduce((acc, booking) => {
    const month = new Date(booking.date).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = { totalRate: 0, count: 0 };
    }
    acc[month].totalRate += booking.dailyRate;
    acc[month].count += 1;
    return acc;
  }, {});

  // Transform the data into the format Recharts expects and merge the metrics
  const chartData = Object.entries(revenueData || {})
    .map(([month, revenue]) => {
      const [year, monthNum] = month.split('-');
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });

      const rateInfo = monthlyRates[month];
      const avgDailyRate = rateInfo ? rateInfo.totalRate / rateInfo.count : 0;

      return {
        name: `${monthName} '${year.slice(2)}`,
        revenue: revenue,
        avgDailyRate: avgDailyRate,
        fullDate: new Date(parseInt(year), parseInt(monthNum) - 1)
      }
    })
    .sort((a, b) => a.fullDate - b.fullDate);

  if (!chartData || chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-center py-10 text-gray-500">No monthly data to display.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={chartData}
        margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="left"
          dataKey="revenue"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value / 1000}k`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          dataKey="avgDailyRate"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => toCurrency(value, true)}
        />
        <Tooltip
          cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          content={<CustomTooltip />}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="hsl(var(--nextui-primary))" radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="avgDailyRate" name="Avg. Daily Rate" stroke="hsl(var(--nextui-secondary))" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
