import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
  <main className="flex justify-center place-items-center h-screen">
    <SignIn />
  </main>
  )
}