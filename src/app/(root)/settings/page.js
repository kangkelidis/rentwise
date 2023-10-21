import { SettingsForm } from "@/components/forms/SettingsForm";
import { fetchGroups } from "@/lib/actions/group.actions";

export default async function Page(props) {
    const groups = fetchGroups()

    const [data] = await Promise.all([groups])

    return (
        <main>
            <h2 className="head-text">Settings</h2>
            <SettingsForm data={JSON.stringify(data)}/>
        </main>
    )
}
