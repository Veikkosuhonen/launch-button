import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-white">
      <h1 className="text-4xl font-bold mb-8">GitHub Actions Monitor</h1>
      <p className="mb-8 text-slate-400">Monitor your repository workflows in real-time.</p>
      <form
        action={async () => {
          "use server"
          await signIn("github")
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Sign in with GitHub
        </button>
      </form>
    </div>
  )
}
