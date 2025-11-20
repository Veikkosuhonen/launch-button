import { RepoListSmart } from "@/components/RepoListSmart"

export default async function Dashboard() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Your Repositories</h1>
      <RepoListSmart />
    </div>
  )
}
