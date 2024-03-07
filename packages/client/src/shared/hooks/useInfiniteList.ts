import { useMemo } from "react"

export default <T>(data: { pages: { items: T[] }[] } | undefined) => {
    return useMemo(() => data?.pages.map((x) => x.items).flat(), [data])
}
