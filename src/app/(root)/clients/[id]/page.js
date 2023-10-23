import { ClientForm } from "@/components/forms/ClientForm";
import { fetchClient } from "@/lib/actions/client.actions";

export default async function Page({ params }) {
    const client = fetchClient(params.id) 
    const result = await Promise.all([client])
    const data = {
        client: result[0]
    }

    return (
        <main>
            <h2 className="head-text">Edit</h2>
            <ClientForm data={JSON.stringify(data)} />
        </main>
    )
}
