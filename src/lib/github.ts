import { Octokit } from "@octokit/rest"

export const getOctokit = (accessToken: string) => {
  return new Octokit({
    auth: accessToken,
  })
}

export interface Repository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  html_url: string
  private: boolean
}

export interface WorkflowRunsResponse {
  total_count: number
  workflow_runs: WorkflowRun[]
}

export interface WorkflowRun {
  id: number
  name?: string | null
  status?: string | null
  conclusion?: string | null
  html_url: string
  created_at: string
  actor?: {
    login: string
    avatar_url: string
  } | null
}

export interface Release {
  id: number
  name: string | null
  tag_name: string
  published_at: string | null
  html_url: string
  body?: string | null
  author: {
    login: string
    avatar_url: string
  }
}

export interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name?: string
      date?: string
    } | null
  }
  html_url: string
  author: any
}
