import {
    Icon24Add,
    Icon24Like,
    Icon24LikeOutline,
    Icon24MoreHorizontal,
    Icon28AddOutline,
    Icon28CheckCircleOutline,
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
    Group,
    Header,
    Headline,
    ModalPageHeader,
    PanelHeaderBack,
    Progress,
    Snackbar,
    Subhead,
} from "@vkontakte/vkui"
import { useState } from "react"
import { StackBackground } from "../entities/stack/ui/stack-background"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
import { useModal } from "../features/modal/contexts/modal-context"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { decodeStackBackground } from "../shared/helpers/stackBackground"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { PlayGame } from "./play-game"
import { StackCreateModal } from "./stack-create"
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
    const addTranslationToOtherStackModal = useModalState()
    const addTranslationToStackActionSheet = useModalState()
    const translationAddedToStackSnackbar = useModalState()
    const createTranslationModal = useModalState()
    const editStackModal = useModalState()
    const playGameModal = useModalState()

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

    const decodedBackground = decodeStackBackground(data?.encodedBackground)

    const exploringStackProgress =
        ((data?.exploredTranslationsCount ?? 0) / (data?.translations?.length ?? 0)) * 100

    return (
        <>
            <ModalPageHeader
                className={"z-20"}
                before={<PanelHeaderBack onClick={() => modal?.onClose()} />}
                children={data?.name}
            />

            <div className={"flex flex-col relative"}>
                <div
                    style={{
                        backgroundColor: decodedBackground?.primaryColor ?? "#fff",
                    }}
                    className={
                        "absolute w-[360px] aspect-square -z-1 left-1/2 -translate-x-1/2 opacity-50 -top-[260px] rounded-full blur-3xl"
                    }
                ></div>
                <div className={"flex flex-row items-center justify-center gap-6 py-3 z-20"}>
                    <div
                        className={"rounded-full p-2.5 bg-vk-content text-accent cursor-pointer"}
                        onClick={showMore.open}
                    >
                        <Icon24MoreHorizontal />
                    </div>
                    <div
                        className={
                            "w-[200px] aspect-square bg-vk-default rounded-xl overflow-hidden"
                        }
                    >
                        {data && (
                            <StackBackground
                                encodedBackground={data.encodedBackground}
                                // imageUrl={data?.imageUrl}
                            />
                        )}
                    </div>
                    <div
                        className={"rounded-full p-2.5 bg-vk-content text-accent cursor-pointer"}
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
                        <Subhead className={"text-center text-secondary"}>
                            {data?.description}
                        </Subhead>
                    </Div>
                )}
                <Group>
                    <Div>
                        <ButtonGroup stretched>
                            <Button
                                mode={"primary"}
                                stretched
                                size={"l"}
                                children={"Играть"}
                                onClick={playGameModal.open}
                            />
                            <Button
                                mode={"secondary"}
                                stretched
                                size={"l"}
                                before={<Icon24Add />}
                                children={"Дублировать"}
                            />
                        </ButtonGroup>
                    </Div>
                </Group>
                <Group>
                    <Header
                        mode={"primary"}
                        indicator={data?.translations?.length}
                        aside={
                            data?.isEditable && (
                                <div
                                    className={"text-accent cursor-pointer"}
                                    onClick={addTranslationToStackActionSheet.open}
                                >
                                    <Icon24Add />
                                </div>
                            )
                        }
                        children={"Переводы"}
                    />

                    <Div className={"py-0"}>
                        <div className={"bg-vk-secondary rounded-xl p-3 flex-col gap-2"}>
                            <Headline>
                                {exploringStackProgress > 0 ? (
                                    <>
                                        Стопка изучена на <b>{exploringStackProgress}%</b>
                                    </>
                                ) : (
                                    <>
                                        Стопка еще не изучена.{" "}
                                        {data?.isVerified
                                            ? "За неё начисляется опыт"
                                            : "За неё не начисляется опыт"}
                                    </>
                                )}
                            </Headline>
                            {exploringStackProgress > 0 && (
                                <Progress value={exploringStackProgress} />
                            )}
                        </div>
                    </Div>

                    <Div className={"grid grid-cols-cards gap-3"}>
                        {data?.translations?.map(({ translation }) => (
                            <FeedTranslationCard
                                key={translation.id}
                                foreign={translation.foreign}
                                vernacular={translation.vernacular}
                                authorName={translation.author.firstName}
                                authorAvatarUrl={getSuitableAvatarUrl(
                                    translation.author.avatarUrls,
                                    32
                                )}
                                onAdd={() => {
                                    vibrateOnClick()
                                    setSelectedTranslation(translation.id)
                                    addTranslationToOtherStackModal.open()
                                    refetch()
                                }}
                                onClick={() => {
                                    vibrateOnClick()
                                    setSelectedTranslation(translation.id)
                                    translationViewModal.open()
                                }}
                                isWithMore={true}
                                onRemoveFromStack={
                                    data.isEditable
                                        ? () => {
                                              vibrateOnClick()
                                              deleteTranslationFromStack({
                                                  translationId: translation.id,
                                                  stackId: id,
                                              })
                                          }
                                        : undefined
                                }
                            />
                        ))}
                    </Div>
                </Group>
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
                    {/* TODO доделать */}
                    <div>В разрабокте</div>
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={addTranslationToOtherStackModal.isOpened}
                onClose={addTranslationToOtherStackModal.close}
            >
                <ModalBody>
                    {selectedTranslation && (
                        <TranslationAddToStack
                            translationId={selectedTranslation}
                            onClose={addTranslationToOtherStackModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={createTranslationModal.isOpened}
                onClose={createTranslationModal.close}
            >
                <ModalBody>
                    <TranslationAdd
                        onClose={createTranslationModal.close}
                        onAdd={() => {
                            refetch()
                            createTranslationModal.close()
                            translationAddedToStackSnackbar.open()
                        }}
                        defaultValues={{
                            saveToStackId: id,
                        }}
                    />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={editStackModal.isOpened} onClose={editStackModal.close}>
                <ModalBody>
                    <StackCreateModal
                        id={id}
                        onClose={editStackModal.close}
                        name={data?.name}
                        palette={data?.palette}
                        pattern={data?.pattern}
                        description={data?.description}
                    />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={playGameModal.isOpened} onClose={playGameModal.close}>
                <ModalBody fullscreen={true}>
                    <PlayGame onClose={playGameModal.close} stackId={id} />
                </ModalBody>
            </ModalWrapper>

            {showMore.isOpened && (
                <ActionSheet onClose={showMore.close} className={"z-30"} toggleRef={undefined}>
                    {data?.isEditable && (
                        <ActionSheetItem
                            before={<Icon28EditOutline />}
                            children={"Редактировать стопку"}
                            onClick={editStackModal.open}
                        />
                    )}
                    <ActionSheetItem before={<Icon28ShareOutline />} children={"Поделиться"} />
                    <ActionSheetItem
                        before={<Icon28ReportOutline />}
                        mode={"destructive"}
                        children={"Пожаловаться"}
                    />
                    {data?.isEditable && (
                        <ActionSheetItem
                            before={<Icon28DeleteOutline />}
                            mode={"destructive"}
                            children={"Удалить стопку"}
                            // TODO
                        />
                    )}
                </ActionSheet>
            )}

            {addTranslationToStackActionSheet.isOpened && (
                <ActionSheet onClose={addTranslationToStackActionSheet.close} toggleRef={undefined}>
                    <ActionSheetItem
                        before={<Icon28AddOutline />}
                        children={"Добавить существующий перевод"}
                        onClick={addTranslationToStackModal.open}
                    />
                    <ActionSheetItem
                        before={<Icon28AddOutline />}
                        children={"Создать новый перевод"}
                        onClick={createTranslationModal.open}
                    />
                </ActionSheet>
            )}

            {translationAddedToStackSnackbar.isOpened && (
                <Snackbar
                    onClose={translationAddedToStackSnackbar.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    children={"Перевод добавлен в стопку"}
                />
            )}
        </>
    )
}
