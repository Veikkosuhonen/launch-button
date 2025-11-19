import { auth } from "@/auth"
import { getOctokit } from "@/lib/github"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const session = await auth()
  if (!session?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { owner, repo } = await params
  const octokit = getOctokit(session.accessToken)

  try {
    const { data } = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 10,
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
