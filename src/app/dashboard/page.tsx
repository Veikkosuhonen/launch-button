import { auth } from "@/auth"
import { RepoListSmart } from "@/components/RepoListSmart"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()

  if (!session?.accessToken) {
    redirect("/")
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Your Repositories</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Signed in as {session.user?.name}</span>
        </div>
      </header>
      <RepoListSmart />
    </div>
  )
}
