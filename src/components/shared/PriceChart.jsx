'use client'

import { getPrice } from '@/lib/price/rates'
import { toCurrency } from '@/lib/utils'
import {
	Bar,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const LINE_COLOR = 'red'
const BAR_COLOR = 'rgba(134,126,255,0.5)'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-slate-500 p-5 flex flex-col gap-5">
          <p className="">{`Days: ${label}`}</p>
          <p className="text-body-bold" style={{color:'blue'}}>{`Total: ${toCurrency(payload[0].value)}`}</p>
          <p className="text-body-bold" style={{color:'red'}}>{`Per Day: ${toCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
    
    return null;
};

export default function PriceChart({ rate }) {
    let data = []
    for (let i = 0; i < 90; i++) {
        const t = getPrice(rate, null, null, i + 1)
        data[i] = { name: i + 1, total: t, per_day: Math.round((t / (i+1)) *100) /100 }
    }
	return (
		<ResponsiveContainer width='100%' height={350}>
			<ComposedChart data={data}>
				<XAxis
					dataKey='name'
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					yAxisId={1}
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `€${value}`}
				/>
				<YAxis
					yAxisId={2}
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `€${value}`}
                    hide={true}
				/>
				<Bar dataKey='total' yAxisId={1} fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
				<Line type='monotone' yAxisId={2} dataKey='per_day' stroke={LINE_COLOR} strokeWidth={3} />

				<Tooltip content={CustomTooltip}/>
			</ComposedChart>
		</ResponsiveContainer>
	)
}
