"use client"

import useSWR from "swr"
import { Repository } from "@/lib/github"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HeartbeatEffect } from "./HeartbeatEffect"
import { useReleases } from "@/hooks/useReleases"
import { spaceMono } from "@/lib/fonts"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const StatusColors = {
  Exceptional: "bg-violet-400",
  Good: "bg-green-500",
  Healthy: "bg-teal-500",
  Endangered: "bg-red-300",
  Dead: "bg-red-500"
}

export function RepoHeaderSmart({ owner, repo }: { owner: string; repo: string }) {
  const { data: repository, error, isLoading } = useSWR<Repository>(
    `/api/github/${owner}/${repo}`,
    fetcher
  )

  const { releases } = useReleases({ owner, repo })

  const heat = releases ? releases.reduce((acc, release) => {
    const date = release.published_at ? Date.parse(release.published_at) : 0
    const agoDays = (Date.now() - date) / 1000 / 60 / 60 / 24
    const heat = 2.0 / (agoDays + 2)
    return acc + heat
  }, 0) : 0

  const status: keyof typeof StatusColors = heat > 3 ?
    "Exceptional" :
    heat > 1.9
    ? "Good" :
    heat > 0.95
      ? "Healthy" 
      : heat > 0.6
        ? "Endangered" 
        : "Dead"

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
    <div className="mb-6 flex items-center gap-6">
      <div className="flex-1">
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
      <div className="flex-1 px-4 card-border h-32 flex items-center justify-center relative">
        <p className="text-xs text-muted-foreground absolute top-0 left-4">RELEASE HEAT: <span className={`${spaceMono.className} text-primary`}>{heat.toFixed(2)}</span></p>
        <p className="text-xs text-muted-foreground absolute top-0 right-4">STATUS: <span className={`${StatusColors[status]} uppercase text-black font-bold px-1 py-0.5`}>{status}</span></p>
        <HeartbeatEffect heat={heat} />
      </div>
    </div>
  )
}
