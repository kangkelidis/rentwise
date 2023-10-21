import { OwnerForm } from "@/components/forms/OwnerForm";
import { fetchOwner } from "@/lib/actions/owner.actions";

export default async function Page({ params }) {
    const owner = await fetchOwner(params.id) 
    
    return (
        <main>
            <h2 className="head-text">Edit</h2>
            <OwnerForm owner={JSON.stringify(owner)} />
        </main>
    )
}
