"use client"

import useSWR from "swr"
import { Repository } from "@/lib/github"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RepoHeaderSmart({ owner, repo }: { owner: string; repo: string }) {
  const { data: repository, error, isLoading } = useSWR<Repository>(
    `/api/github/${owner}/${repo}`,
    fetcher
  )

  if (error) return <div className="text-destructive mb-8">Failed to load repository details</div>
  
  if (isLoading || !repository) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="mb-4 h-5 w-32 bg-card rounded"></div>
        <div className="h-9 w-64 bg-card rounded mb-2"></div>
        <div className="h-6 w-96 bg-card rounded"></div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <Link
        href="/dashboard"
        className="mb-2 inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-1 h-3 w-3" />
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-foreground">{repository.full_name}</h1>
      <p className="text-sm text-muted-foreground">{repository.description}</p>
    </div>
  )
}
