'use client'

import OrderCard from "../elements/OrderCard"

export default function DailyPlan({ orders }) {    

    try {
        orders = JSON.parse(orders)
    } catch (error) {
    }    
    // calendar
    // date
    // header
    // row card
    return (
        <div>
            {orders?.map(order => {
                return (
                    <div>
                        <OrderCard order={order} />
                    </div>
                )
            })}
        </div>
        )
}
