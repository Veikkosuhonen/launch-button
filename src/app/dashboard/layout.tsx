import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.accessToken) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span>Launch</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Signed in as {session.user?.name}
            </span>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
