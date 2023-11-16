import { SignIn } from "@clerk/nextjs";

export default async function Page() {
  return (
  <main className="flex justify-center place-items-center h-screen">
    <SignIn />
  </main>
  )
}