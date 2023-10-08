import { orderColumns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/lib/actions/order.actions";
import Link from 'next/link'

async function getData() {
    const orders = await fetchOrders()
    return orders.map(order => ({id: order.id, pickup: order.pick_up_date, dropoff: order.drop_off_date, vehicle: order.vehicle_id.make + " " + order.vehicle_id.model + ", " + order.vehicle_id.registration}))
}

export default async function Page() {
    const data = await getData()

    return (
        <main>
            <h2 className="head-text">Orders</h2>
            <Button><Link href={'/orders/create'}>Add Order</Link></Button>
            <DataTable columns={orderColumns} data={data} />
        </main>
    )
}
