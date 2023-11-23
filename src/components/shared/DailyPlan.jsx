'use client'

import OrderCard from "../elements/OrderCard"

export default function DailyPlan({ data }) {    

    try {
        data = JSON.parse(data)
    } catch (error) {
    }    
    // calendar
    // date
    // header
    // row card
    return (
        <div className="flex flex-col gap-4">
            {data?.orders?.map(order => {
                return (
                    <div key={order.id}>
                        <OrderCard order={order.data} type={order.type} settings={data.settings} />
                    </div>
                )
            })}
        </div>
        )
}
