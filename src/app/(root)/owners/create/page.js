import { OwnerForm } from '@/components/forms/OwnerForm'

export default async function Page(props) {
	return (
		<main>
			<h2 className='head-text'>Add a new Owner</h2>
			<OwnerForm />
		</main>
	)
}
