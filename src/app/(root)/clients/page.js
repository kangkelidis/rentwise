import { clientColumns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button";
import { fetchClients } from "@/lib/actions/client.actions";
import Link from 'next/link'

async function getData() {
    const clients = await fetchClients()
    return clients.map(client => 
        ({id: client.id, name: client.first_name + ' ' + client.last_name}))
}

export default async function Page() {
    const data = await getData()

    return (
        <main>
            <h2 className="head-text">Clients</h2>
            <Button><Link href={'/clients/create'}>Add Client</Link></Button>
            <DataTable columns={clientColumns} data={data} />
        </main>
    )
}
