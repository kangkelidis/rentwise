import { ClientForm } from "@/components/forms/ClientForm";


export default async function Page(props) {


    return (
        <main>
            <h2 className="head-text">Add a new Client</h2>
            <ClientForm />
        </main>
    )
}
