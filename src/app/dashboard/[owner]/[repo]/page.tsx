import { WorkflowRunsList } from "@/components/WorkflowRunsList"
import { ReleaseListSmart } from "@/components/ReleaseListSmart"
import { CommitListSmart } from "@/components/CommitListSmart"
import { RepoHeaderSmart } from "@/components/RepoHeaderSmart"

export default async function RepoPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = await params

  return (
    <div className="min-h-screen p-4 md:p-6">
      <RepoHeaderSmart owner={owner} repo={repo} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="space-y-2 card-border p-4">
            <h2 className="text-lg font-semibold text-foreground">Unreleased Commits</h2>
            <CommitListSmart owner={owner} repo={repo} />
          </section>

          <section className="space-y-2 card-border p-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Workflow Runs</h2>
            <WorkflowRunsList owner={owner} repo={repo} />
          </section>
        </div>
        
        <div className="space-y-2 card-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Releases</h2>
          <ReleaseListSmart owner={owner} repo={repo} />
        </div>
      </div>
    </div>
  )
}
