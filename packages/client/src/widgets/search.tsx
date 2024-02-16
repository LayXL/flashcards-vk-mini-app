import { useEffect, useRef, useState } from "react"
import { trpc } from "../shared/api"
import { PanelHeader, PanelHeaderClose, Search as SearchBar } from "@vkontakte/vkui"
import { useDebounceValue, useTimeout } from "usehooks-ts"

type SearchProps = {
    onClose?: () => void
}

export const Search = ({ onClose }: SearchProps) => {
    const searchBarRef = useRef<HTMLInputElement | null>(null)

    const [searchQuery, setSearchQuery] = useState("")

    const [debouncedSearchQuery] = useDebounceValue(searchQuery, 200)

    const { data, refetch } = trpc.search.useQuery(
        {
            query: debouncedSearchQuery,
        },
        {
            enabled: false,
        },
    )

    useEffect(() => {
        if (debouncedSearchQuery.length >= 3) refetch()
    }, [debouncedSearchQuery, refetch])

    useTimeout(() => {
        searchBarRef.current?.focus()
    }, 300)

    return (
        <>
            <PanelHeader before={<PanelHeaderClose onClick={onClose} />} children={"Поиск"} />
            <SearchBar
                getRef={searchBarRef}
                value={searchQuery}
                onChange={({ currentTarget: { value } }) => setSearchQuery(value)}
            />

            {data?.translations.map((translation) => (
                <div>{translation.vernacular}</div>
            ))}
        </>
    )
}
