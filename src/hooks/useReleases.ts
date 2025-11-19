import { Release } from "@/lib/github"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const useReleases = ({ owner, repo }: { owner: string; repo: string }) => {
    const { data: releases, error, isLoading } = useSWR<Release[]>(
        `/api/github/${owner}/${repo}/releases`,
        fetcher
    )

    return {
        releases,
        error,
        isLoading
    }
}