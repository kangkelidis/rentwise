import { OwnerForm } from "@/components/forms/OwnerForm";
import { fetchOwner } from "@/lib/actions/owner.actions";

export default async function Page({ params }) {
    const owner = fetchOwner(params.id) 
    
    const result = await Promise.all([owner])
    const data = {
        owner: result[0],
    }

    return (
        <main>
            <h2 className="head-text">Edit</h2>
            <OwnerForm data={JSON.stringify(data)} />
        </main>
    )
}
