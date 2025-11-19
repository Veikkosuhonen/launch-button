import { auth } from "@/auth"
import { getOctokit } from "@/lib/github"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const octokit = getOctokit(session.accessToken)

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
