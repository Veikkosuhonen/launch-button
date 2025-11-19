"use client"

import useSWR from "swr"
import { Repository } from "@/lib/github"
import Link from "next/link"
import { Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardSkeleton } from "@/components/Card"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RepoListSmart() {
  const { data: repos, error, isLoading } = useSWR<Repository[]>(
    "/api/github/repos",
    fetcher
  )

  if (error) return <div className="text-red-500">Failed to load repositories</div>
  if (isLoading) return <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {(repos || []).map((repo) => (
        <Link
          key={repo.id}
          href={`/dashboard/${repo.owner.login}/${repo.name}`}
          className="block transition-all hover:opacity-100 group"
        >
          <Card className1="h-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="h-6 w-6 rounded-full ring-1 ring-border"
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{repo.owner.login}</span>
                </div>
                {repo.private && <Lock className="h-3 w-3 text-muted-foreground" />}
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">{repo.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {repo.description || "No description provided"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
