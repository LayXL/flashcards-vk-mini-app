import {
    Icon24Add,
    Icon24Like,
    Icon24LikeOutline,
    Icon24MoreHorizontal,
    Icon28DeleteOutline,
    Icon28EditOutline,
    Icon28ReportOutline,
    Icon28ShareOutline,
} from "@vkontakte/icons"
import {
    ActionSheet,
    ActionSheetItem,
    Button,
    ButtonGroup,
    Div,
    Header,
    ModalPageHeader,
    PanelHeaderBack,
    Subhead,
} from "@vkontakte/vkui"
import { useState } from "react"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
import { useModal } from "../features/modal/contexts/modal-context"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { vibrateOnClick } from "../shared/helpers/vibrateOnClick"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationAdd } from "./translation-add"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationView } from "./translation-view"

type StackViewProps = {
    id: number
}

export const StackView = ({ id }: StackViewProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)
    const translationViewModal = useModalState()
    const addTranslationToStackModal = useModalState()
    const createTranslationModal = useModalState()

    const modal = useModal()
    const { data, refetch } = trpc.stacks.getSingle.useQuery({ id })

    const showMore = useModalState()

    const { mutate: deleteTranslationFromStack } = trpc.stacks.removeTranslation.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: addReaction } = trpc.stacks.addReaction.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: removeReaction } = trpc.stacks.removeReaction.useMutation({
        onSuccess: () => refetch(),
    })

    return (
        <>
            <ModalPageHeader
                className="z-20"
                before={<PanelHeaderBack onClick={() => modal?.onClose()} />}
                children={data?.name}
            />

            <div className="flex flex-col relative ">
                <div className="absolute bg-blue-300 w-[360px] aspect-square -z-1 left-1/2 -translate-x-1/2 opacity-50 -top-[260px] rounded-full blur-3xl"></div>
                <div className="flex flex-row items-center justify-center gap-6 py-3 z-20">
                    <div
                        className="rounded-full p-2.5 bg-vk-content text-accent cursor-pointer"
                        onClick={showMore.open}
                    >
                        <Icon24MoreHorizontal />
                    </div>
                    <div className="w-[200px] aspect-square bg-vk-default rounded-xl"></div>
                    <div
                        className="rounded-full p-2.5 bg-vk-content text-accent cursor-pointer"
                        onClick={() => {
                            vibrateOnClick()
                            data?.isLiked
                                ? removeReaction({ stackId: id })
                                : addReaction({ stackId: id })
                        }}
                    >
                        {data?.isLiked ? <Icon24Like /> : <Icon24LikeOutline />}
                    </div>
                </div>
                {data?.description && (
                    <Div>
                        <Subhead className="text-center text-secondary ">
                            {data?.description}
                        </Subhead>
                    </Div>
                )}
                <Div>
                    <ButtonGroup stretched>
                        <Button mode="primary" stretched size="l">
                            Играть
                        </Button>
                        <Button mode="secondary" stretched size="l" before={<Icon24Add />}>
                            Дублировать
                        </Button>
                    </ButtonGroup>
                </Div>
                <Header
                    mode="primary"
                    indicator={data?.translations?.length}
                    aside={
                        <div
                            className="text-accent cursor-pointer"
                            onClick={createTranslationModal.open}
                        >
                            <Icon24Add />
                        </div>
                    }
                >
                    Переводы
                </Header>
                <Div className="grid grid-cols-cards gap-3">
                    {data?.translations?.map(({ translation }) => (
                        <FeedTranslationCard
                            key={translation.id}
                            foreign={translation.foreign}
                            vernacular={translation.vernacular}
                            authorName={translation.author.firstName}
                            authorAvatarUrl={getSuitableAvatarUrl(
                                translation.author.avatarUrls,
                                32,
                            )}
                            onAdd={() => {
                                vibrateOnClick()
                                setSelectedTranslation(translation.id)
                                addTranslationToStackModal.open()
                            }}
                            onClick={() => {
                                vibrateOnClick()
                                setSelectedTranslation(translation.id)
                                translationViewModal.open()
                            }}
                        />
                    ))}
                </Div>
            </div>

            <ModalWrapper
                isOpened={translationViewModal.isOpened}
                onClose={translationViewModal.close}
            >
                <ModalBody>
                    {selectedTranslation && (
                        <TranslationView
                            id={selectedTranslation}
                            onClose={translationViewModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={addTranslationToStackModal.isOpened}
                onClose={addTranslationToStackModal.close}
            >
                <ModalBody>
                    {selectedTranslation && (
                        <TranslationAddToStack
                            translationId={selectedTranslation}
                            onClose={addTranslationToStackModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={createTranslationModal.isOpened}
                onClose={createTranslationModal.close}
            >
                <ModalBody>
                    <TranslationAdd onClose={createTranslationModal.close} />
                </ModalBody>
            </ModalWrapper>

            {showMore.isOpened && (
                <ActionSheet onClose={showMore.close} className="z-30" toggleRef={undefined}>
                    <ActionSheetItem
                        before={<Icon28EditOutline />}
                        children={"Редактировать стопку"}
                    />
                    <ActionSheetItem before={<Icon28ShareOutline />} children={"Поделиться"} />
                    <ActionSheetItem
                        before={<Icon28ReportOutline />}
                        mode="destructive"
                        children={"Пожаловаться"}
                    />
                    <ActionSheetItem
                        before={<Icon28DeleteOutline />}
                        mode="destructive"
                        children={"Удалить стопку"}
                    />
                </ActionSheet>
            )}
        </>
    )
}
