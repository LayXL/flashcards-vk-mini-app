import { Icon32Cards2Outline, Icon56SearchOutline } from "@vkontakte/icons"
import {
    CardScroll,
    Div,
    Group,
    Header,
    Link,
    ModalPageHeader,
    PanelHeaderBack,
    PanelHeaderClose,
    Placeholder,
    Search as SearchBar,
} from "@vkontakte/vkui"
import { useEffect, useRef, useState } from "react"
import { useDebounceValue, useTimeout } from "usehooks-ts"
import { SearchStackCard } from "../entities/stack/ui/search-stack-card"
import { SearchTranslationCard } from "../entities/translation/ui/search-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"

type SearchProps = {
    onClose?: () => void
}

export const Search = ({ onClose }: SearchProps) => {
    const moreTranslationsModal = useModalState()
    const moreStacksModal = useModalState()

    const searchBarRef = useRef<HTMLInputElement | null>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery] = useDebounceValue(searchQuery, 200)

    const [{ data, refetch, isSuccess }] = useDebounceValue(
        trpc.search.useQuery({ query: debouncedSearchQuery }, { enabled: false }),
        200
    )

    useEffect(() => {
        if (debouncedSearchQuery.length >= 3) refetch()
    }, [debouncedSearchQuery, refetch])

    useTimeout(() => {
        searchBarRef.current?.focus()
    }, 500)

    return (
        <>
            <ModalPageHeader before={<PanelHeaderBack onClick={onClose} />} children={"Поиск"} />

            <SearchBar
                getRef={searchBarRef}
                value={searchQuery}
                onChange={({ currentTarget: { value } }) => setSearchQuery(value)}
            />

            {debouncedSearchQuery.length < 3 ? (
                <Placeholder
                    icon={<Icon32Cards2Outline width={56} height={56} />}
                    children={"Начните вводить запрос сверху, чтобы найти коллекцию или перевод"}
                />
            ) : data?.translations?.length === 0 && data?.stacks?.length === 0 && isSuccess ? (
                <Placeholder
                    icon={<Icon56SearchOutline />}
                    children={"По вашему запросу ничего не найдено..."}
                />
            ) : (
                <>
                    {(data?.translations?.length ?? 0) > 0 && (
                        <Group>
                            <Header
                                aside={
                                    <Link
                                        children={"Показать все"}
                                        onClick={moreTranslationsModal.open}
                                    />
                                }
                                children={"Переводы"}
                            />

                            <CardScroll className={"overflow-visible"}>
                                <Div className={"flex gap-3 overflow-visible px-0"}>
                                    {data?.translations.map((translation) => (
                                        <SearchTranslationCard
                                            key={translation.id}
                                            id={translation.id}
                                            vernacular={translation.vernacular}
                                            foreign={translation.foreign}
                                            languageVariationsFlags={["ame", "bre"]}
                                        />
                                    ))}
                                </Div>
                            </CardScroll>
                        </Group>
                    )}
                    {(data?.stacks?.length ?? 0) > 0 && (
                        <Group>
                            <Header
                                aside={
                                    <Link
                                        children={"Показать все"}
                                        onClick={moreStacksModal.open}
                                    />
                                }
                                children={"Коллекции"}
                            />

                            <CardScroll className={"overflow-visible"}>
                                <Div className={"flex gap-3 overflow-visible px-0"}>
                                    {data?.stacks.map((stack) => (
                                        <SearchStackCard
                                            key={stack.id}
                                            id={stack.id}
                                            name={stack.name}
                                            cardsCount={stack.translationsCount}
                                            isLiked={stack.isLiked}
                                        />
                                    ))}
                                </Div>
                            </CardScroll>
                        </Group>
                    )}
                </>
            )}

            <ModalWrapper
                isOpened={moreTranslationsModal.isOpened}
                onClose={moreTranslationsModal.close}
            >
                <ModalBody fullscreen>
                    <ModalPageHeader
                        before={<PanelHeaderClose onClick={moreTranslationsModal.close} />}
                        children={"Переводы по запросу"}
                    />
                    <Div className={"grid grid-cols-cards gap-2"}>
                        {data?.translations.map((translation) => (
                            <div className={"[&>div>div]:w-full"}>
                                <SearchTranslationCard
                                    key={translation.id}
                                    id={translation.id}
                                    vernacular={translation.vernacular}
                                    foreign={translation.foreign}
                                    languageVariationsFlags={["ame"]}
                                />
                            </div>
                        ))}
                    </Div>
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={moreStacksModal.isOpened} onClose={moreStacksModal.close}>
                <ModalBody fullscreen>
                    <ModalPageHeader
                        before={<PanelHeaderClose onClick={moreStacksModal.close} />}
                        children={"Коллекции по запросу"}
                    />
                    <Div className={"grid grid-cols-cards gap-2"}>
                        {data?.stacks.map((stack) => (
                            <div className={"[&>div>div]:w-full"}>
                                <SearchStackCard
                                    key={stack.id}
                                    id={stack.id}
                                    name={stack.name}
                                    cardsCount={stack.translationsCount}
                                    isLiked={stack.isLiked}
                                />
                            </div>
                        ))}
                    </Div>
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
