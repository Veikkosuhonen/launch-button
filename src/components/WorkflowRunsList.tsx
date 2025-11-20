"use client"

import useSWR from "swr"
import { WorkflowRunsResponse } from "@/lib/github"
import { CheckCircle, XCircle, Clock, PlayCircle } from "lucide-react"
import { clsx } from "clsx"
import { Card, CardSkeleton } from "@/components/Card"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const StatusIcon = ({ status, conclusion }: { status?: string | null; conclusion?: string | null }) => {
  if (status === "queued" || status === "in_progress") {
    return <PlayCircle className="h-4 w-4 text-yellow-500 animate-pulse" />
  }
  if (conclusion === "success") {
    return <CheckCircle className="h-4 w-4 text-green-500/50" /> // Muted green
  }
  if (conclusion === "failure") {
    return <XCircle className="h-4 w-4 text-primary animate-pulse" /> // Bright red
  }
  return <Clock className="h-4 w-4 text-muted-foreground" />
}

export function WorkflowRunsList({ owner, repo }: { owner: string; repo: string }) {
  const { data, error, isLoading } = useSWR<WorkflowRunsResponse>(
    `/api/github/${owner}/${repo}/workflows`,
    fetcher
  )

  if (error) return <div className="text-destructive">Failed to load workflow runs</div>
  if (isLoading) return <CardSkeleton />

  const runs = data?.workflow_runs || []

  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <Card
          key={run.id}
          className2="flex items-center justify-between hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <StatusIcon status={run.status} conclusion={run.conclusion} />
            <div>
              <a
                href={run.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-primary hover:underline block transition-colors"
              >
                {run.name}
              </a>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{run.actor?.login}</span>
                <span>•</span>
                <span>{new Date(run.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="text-xs font-medium">
            <span
              className={clsx(
                "px-2 py-0.5",
                run.status === "completed" && run.conclusion === "success" && "bg-green-500/5 text-green-500/70 border-green-500/20",
                run.status === "completed" && run.conclusion === "failure" && "bg-primary/10 text-primary border-primary/30",
                (run.status === "queued" || run.status === "in_progress") && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}
            >
              {run.status === "completed" ? run.conclusion : run.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
