"use client"

import useSWR from "swr"
import { Release } from "@/lib/github"
import { Tag, Calendar } from "lucide-react"
import { Card, CardSkeleton } from "@/components/Card"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ReleaseListSmart({ owner, repo }: { owner: string; repo: string }) {
  const { data: releases, error, isLoading } = useSWR<Release[]>(
    `/api/github/${owner}/${repo}/releases`,
    fetcher
  )

  if (error) return <div className="text-destructive">Failed to load releases</div>
  if (isLoading) return <CardSkeleton />

  if (!releases || releases.length === 0) {
    return (
      <Card className="text-center text-sm text-muted-foreground">
        No releases found
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {releases.map((release) => (
        <Card
          key={release.id}
        >
          <div className="flex items-start justify-between mb-1">
            <div>
              <a
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary hover:underline flex items-center gap-2 text-sm transition-colors"
              >
                <Tag className="h-3 w-3 text-primary" />
                {release.name || release.tag_name}
              </a>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <img
                  src={release.author.avatar_url}
                  alt={release.author.login}
                  className="h-3 w-3 rounded-full ring-1 ring-border"
                />
                <span>{release.author.login}</span>
              </div>
            </div>
            {release.published_at && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(release.published_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          {release.body && (
            <div className="text-xs text-muted-foreground line-clamp-2 prose prose-invert max-w-none mt-2">
              {release.body}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
