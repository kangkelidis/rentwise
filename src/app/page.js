import { NewCarForm } from '@/components/create-new-car-form'

export default async function Home() {
  return (
    <main className="flex p-24">
      <NewCarForm />
    </main>
  )
}

