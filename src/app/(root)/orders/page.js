import { Button } from "@/components/ui/button";
import Link from 'next/link'


export default function Page(props) {
    

    return (
        <main>
            <h2 className="head-text">Orders</h2>
            <Button><Link href={'/orders/create'}>Add Order</Link></Button>

        </main>
    )
}
