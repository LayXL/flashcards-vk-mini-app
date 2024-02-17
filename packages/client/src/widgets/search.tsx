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

            <Group>
                <Header aside={<Link children={"Показать все"} />}>Переводы</Header>

                <Div>
                    <div style={{ display: "flex", gap: 12, overflow: "visible" }}>
                        {data?.translations.map((translation) => (
                            <SearchTranslationCard
                                id={translation.id}
                                vernacular={translation.vernacular}
                                foreign={translation.foreign}
                                languageVariationsFlags={["ame"]}
                            />
                        ))}

                        {/* <SearchTranslationCard
                            id={2}
                            vernacular={"Индустрия гостеприимства"}
                            foreign={"Hospitality industry"}
                            languageVariationsFlags={["ame"]}
                        />
                        <SearchTranslationCard
                            id={2}
                            vernacular={"Индустрия гостеприимства"}
                            foreign={"Hospitality industry"}
                            languageVariationsFlags={["bre", "ame"]}
                        /> */}
                    </div>
                </Div>
            </Group>

            <Group>
                <Header aside={<Link children={"Показать все"} />}>Стопки</Header>

                <Div>
                    {/* <div style={{ display: "flex", gap: 12, overflow: "visible" }}>
                        <SearchStackCard />
                        <SearchStackCard />
                        <SearchStackCard />
                    </div> */}
                </Div>
            </Group>
        </>
    )
}
