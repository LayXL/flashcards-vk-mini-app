import { Icon56SearchOutline } from "@vkontakte/icons"
import { Div, Placeholder, Search } from "@vkontakte/vkui"
import { useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationView } from "./translation-view"

type SearchTranslationToStackProps = {
    onSelect: (translationId: number) => void
    stackId: number
}

export const SearchTranslationToStack = ({ onSelect, stackId }: SearchTranslationToStackProps) => {
    const [searchQuery, setSearchQuery] = useState("")

    const [debouncedSearchQuery] = useDebounceValue(searchQuery, 400)

    const { data, isSuccess } = trpc.search.useQuery({
        query: debouncedSearchQuery,
        filter: "translations",
        ignoredTranslationsInStacks: [stackId],
    })

    const viewTranslationModal = useModalState()

    const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(null)

    return (
        <>
            <Search
                value={searchQuery}
                onChange={({ currentTarget: { value } }) => setSearchQuery(value)}
            />

            {searchQuery.length < 3 ? (
                <Placeholder
                    icon={<Icon56SearchOutline />}
                    header={"Начните вводить запрос"}
                    children={"И мы покажем тебе переводы"}
                    stretched
                />
            ) : data?.translations.length === 0 && isSuccess ? (
                <Placeholder
                    icon={<Icon56SearchOutline />}
                    header={"Ничего не найдено"}
                    children={"Измените свой запрос"}
                    stretched
                />
            ) : (
                <Div className={"grid gap-3 grid-cols-cards"}>
                    {data?.translations.map((translation) => (
                        <TranslationCard
                            key={translation.id}
                            foreign={translation.foreign}
                            vernacular={translation.vernacular}
                            onClick={() => {
                                setSelectedTranslationId(translation.id)
                                viewTranslationModal.open()
                            }}
                            onAdd={() => onSelect(translation.id)}
                        />
                    ))}
                </Div>
            )}

            <ModalWindow {...viewTranslationModal} fullscreen>
                {selectedTranslationId && (
                    <TranslationView
                        onClose={viewTranslationModal.close}
                        id={selectedTranslationId}
                    />
                )}
            </ModalWindow>
        </>
    )
}
