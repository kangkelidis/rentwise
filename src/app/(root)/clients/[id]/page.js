import { ClientForm } from "@/components/forms/ClientForm";
import { fetchClient } from "@/lib/actions/client.actions";

export default async function Page({ params }) {
    const client = await fetchClient(params.id) 
    return (
        <main>
            <h2 className="head-text">Edit</h2>
            <ClientForm client={JSON.stringify(client)} />
        </main>
    )
}
