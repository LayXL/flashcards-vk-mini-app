import {
    Div,
    Group,
    Header,
    Link,
    PanelHeader,
    PanelHeaderClose,
    Search as SearchBar,
} from "@vkontakte/vkui"
import { useEffect, useRef, useState } from "react"
import { useDebounceValue, useTimeout } from "usehooks-ts"
import { SearchStackCard } from "../entities/stack/ui/search-stack-card"
import { SearchTranslationCard } from "../entities/translation/ui/search-translation-card"
import { trpc } from "../shared/api"

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

            {(data?.translations?.length ?? 0) > 0 && (
                <Group>
                    <Header aside={<Link children={"Показать все"} />} children={"Переводы"} />

                    <Div>
                        <div style={{ display: "flex", gap: 12, overflow: "visible" }}>
                            {data?.translations.map((translation) => (
                                <SearchTranslationCard
                                    key={translation.id}
                                    id={translation.id}
                                    vernacular={translation.vernacular}
                                    foreign={translation.foreign}
                                    languageVariationsFlags={["ame"]}
                                />
                            ))}
                        </div>
                    </Div>
                </Group>
            )}

            <Group>
                <Header aside={<Link children={"Показать все"} />} children={"Стопки"} />

                <Div>
                    <div style={{ display: "flex", gap: 12, overflow: "visible" }}>
                        <SearchStackCard />
                    </div>
                </Div>
            </Group>
        </>
    )
}
