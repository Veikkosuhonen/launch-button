"use client"

import useSWR from "swr"
import { Commit, Release } from "@/lib/github"
import { GitCommit } from "lucide-react"
import { Card, CardSkeleton } from "@/components/Card"
import { useEffect, useRef } from "react"
import { spaceMono } from "@/lib/fonts"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CommitListSmart({ owner, repo }: { owner: string; repo: string }) {
  const { data: commits, error: commitsError, isLoading: commitsLoading } = useSWR<Commit[]>(
    `/api/github/${owner}/${repo}/commits`,
    fetcher
  )

  const { data: releases, error: releasesError, isLoading: releasesLoading } = useSWR<Release[]>(
    `/api/github/${owner}/${repo}/releases`,
    fetcher
  )

  const latestReleaseDate = releases && releases[0]?.published_at ? new Date(releases[0].published_at) : null

  const pukinkonttiAgeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const updateFn = () => {
      const elapsedTime = latestReleaseDate ? new Date().getTime() - latestReleaseDate.getTime() : null
      const formattedElapsedTime = elapsedTime ? format(elapsedTime, "ddd HH:mm:ss") : ""
      pukinkonttiAgeRef.current!.textContent = formattedElapsedTime
    }

    if (pukinkonttiAgeRef.current) {
      updateFn()
      const clearId = setInterval(() => {
        updateFn()
      }, 1000)

      return () => clearInterval(clearId)
    }
  }, [pukinkonttiAgeRef.current, latestReleaseDate])

  if (commitsError || releasesError) return <div className="text-destructive">Failed to load commits</div>
  if (commitsLoading || releasesLoading) return <CardSkeleton />

  
  const unreleasedCommits = latestReleaseDate && commits
    ? commits.filter((commit) => {
        const commitDate = commit.commit.author?.date
        return commitDate ? new Date(commitDate) > latestReleaseDate : false
      })
    : commits || []

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground mb-2">
          {latestReleaseDate 
            ? `Commits since ${latestReleaseDate.toLocaleDateString()}`
            : "All recent commits (no releases found)"}
        </p>
        <p className="text-xs text-muted-foreground mb-2">
          PUKINKONTTI AGE: <span className={`${spaceMono.className} text-primary`} ref={pukinkonttiAgeRef}></span>
        </p>
      </div>
      {unreleasedCommits.length === 0 ? (
        <Card className2="text-center text-sm text-muted-foreground">
          No unreleased commits found
        </Card>
      ) : (
        <div className="space-y-2">
          {unreleasedCommits.map((commit) => (
            <Card
              key={commit.sha}
            >
              <div className="flex items-start gap-3">
                <GitCommit className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <a
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary hover:underline block truncate transition-colors"
                  >
                    {commit.commit.message.split("\n")[0]}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {commit.author ? (
                      <div className="flex items-center gap-1">
                        <img
                          src={commit.author.avatar_url}
                          alt={commit.author.login}
                          className="h-3 w-3 rounded-full ring-1 ring-border"
                        />
                        <span>{commit.author.login}</span>
                      </div>
                    ) : (
                      <span>{commit.commit.author?.name || 'Unknown author'}</span>
                    )}
                    <span>•</span>
                    <span>{commit.commit.author?.date ? new Date(commit.commit.author.date).toLocaleString() : 'Unknown date'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
