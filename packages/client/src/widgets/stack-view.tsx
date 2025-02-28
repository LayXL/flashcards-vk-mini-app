import { FloatingPortal } from "@floating-ui/react"
import {
    Icon24Add,
    Icon24Like,
    Icon24LikeOutline,
    Icon24MoreHorizontal,
    Icon24Play,
    Icon28AddOutline,
    Icon28CheckCircleOutline,
    Icon28CopyOutline,
    Icon28DeleteOutline,
    Icon28EditOutline,
    Icon28HideOutline,
    Icon28HieroglyphCharacterOutline,
    Icon28ShareOutline,
} from "@vkontakte/icons"
import bridge from "@vkontakte/vk-bridge"
import {
    ActionSheet,
    ActionSheetItem,
    Alert,
    Button,
    ButtonGroup,
    Div,
    Group,
    Header,
    Headline,
    ModalPageHeader,
    PanelHeaderBack,
    Placeholder,
    Progress,
    Snackbar,
    Spacing,
    Subhead,
} from "@vkontakte/vkui"
import { useState } from "react"
import { StackCard } from "../entities/stack/ui/stack-card"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { useModal } from "../features/modal/contexts/modal-context"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { vibrateOnClick, vibrateOnSuccess } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { Skeleton } from "../shared/ui/skeleton"
import { DuplicateStack } from "./duplicate-stack"
import { PlayGame } from "./play-game"
import { SearchTranslationToStack } from "./search-translation-to-stack"
import { StackCreateModal } from "./stack-create"
import { TranslationAdd } from "./translation-add"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationView } from "./translation-view"

type StackViewProps = {
    id: number
    onClose?: () => void
}

export const StackView = ({ id, onClose }: StackViewProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)

    const translationViewModal = useModalState()
    const addTranslationToStackModal = useModalState()
    const addTranslationToOtherStackModal = useModalState()
    const addTranslationToStackActionSheet = useModalState()
    const translationAddedToStackSnackbar = useModalState()
    const stackDuplicatedSnackbar = useModalState()
    const createTranslationModal = useModalState()
    const editStackModal = useModalState()
    const playGameModal = useModalState()
    const duplicateStackModal = useModalState()
    const deleteStackModal = useModalState()
    const showMore = useModalState()

    const modal = useModal()
    const utils = trpc.useUtils()
    const { data, refetch } = trpc.stacks.getSingle.useQuery({ id })
    const { data: currentUser } = trpc.getUser.useQuery()

    const close = () => {
        onClose?.() || modal?.onClose()
    }

    const { mutate: deleteTranslationFromStack } = trpc.stacks.removeTranslation.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: hide } = trpc.stacks.hide.useMutation({ onSuccess: () => refetch() })
    const { mutate: show } = trpc.stacks.show.useMutation({ onSuccess: () => refetch() })

    const { mutate: addTranslationToStack } = trpc.stacks.addTranslation.useMutation({
        onSuccess: () => {
            vibrateOnSuccess()
            refetch()
        },
    })

    const { mutate: addReaction } = trpc.stacks.addReaction.useMutation({
        onMutate: () => {
            utils.stacks.getSingle.setData({ id }, (data) => ({ ...data, isLiked: true }))
        },
        onSuccess: () => refetch(),
    })

    const { mutate: removeReaction } = trpc.stacks.removeReaction.useMutation({
        onMutate: () => {
            utils.stacks.getSingle.setData({ id }, (data) => ({ ...data, isLiked: false }))
        },
        onSuccess: () => refetch(),
    })

    const { mutate: deleteStack } = trpc.stacks.delete.useMutation({
        onSuccess: () => {
            close()
            utils.stacks.getUserStacks.invalidate()
        },
    })

    const exploringStackProgress =
        ((data?.exploredTranslationsCount ?? 0) / (data?.translations?.length ?? 0)) * 100

    return (
        <>
            <ModalPageHeader before={<PanelHeaderBack onClick={close} />} children={"Коллекция"} />

            <div className={"flex flex-col relative"}>
                <div className={"flex flex-row items-center justify-center gap-6 py-3"}>
                    <div
                        className={"rounded-full p-2.5 bg-vk-secondary text-accent cursor-pointer"}
                        onClick={showMore.open}
                    >
                        <Icon24MoreHorizontal />
                    </div>
                    <div className={"max-w-[170px] w-full"}>
                        <StackCard
                            title={data?.name}
                            translationsCount={data?.translations?.length}
                            encodedBackground={data?.encodedBackground}
                            isVerified={data?.isVerified}
                            authorAvatarUrl={getSuitableAvatarUrl(data?.author?.avatarUrls, 32)}
                            authorName={data?.author?.firstName}
                        />
                    </div>
                    <div
                        className={"rounded-full p-2.5 bg-vk-secondary text-accent cursor-pointer"}
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
                        <Subhead className={"text-center text-secondary break-words"}>
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
                                before={<Icon24Play />}
                                onClick={playGameModal.open}
                            />
                            <Button
                                mode={"secondary"}
                                stretched
                                size={"l"}
                                children={"Дублировать"}
                                onClick={duplicateStackModal.open}
                            />
                        </ButtonGroup>
                    </Div>
                </Group>
                <Group>
                    <Header
                        mode={"primary"}
                        indicator={
                            (data?.translations?.length ?? 0) > 0
                                ? data?.translations?.length
                                : undefined
                        }
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

                    {(data?.translations?.length ?? 0) > 0 && (
                        <Div className={"py-0"}>
                            <div className={"bg-vk-secondary rounded-xl p-3 flex-col gap-2"}>
                                <Headline>
                                    {data ? (
                                        exploringStackProgress > 0 ? (
                                            <>
                                                Коллекция изучена на{" "}
                                                <b>{Math.round(exploringStackProgress)}%</b>
                                            </>
                                        ) : (
                                            <>
                                                Коллекция еще не изучена.{" "}
                                                {data?.isVerified
                                                    ? "За неё начисляется опыт"
                                                    : "За неё не начисляется опыт"}
                                            </>
                                        )
                                    ) : (
                                        <Skeleton className={"w-40 bg-white dark:bg-black/20"} />
                                    )}
                                </Headline>
                                {exploringStackProgress > 0 && (
                                    <Progress value={exploringStackProgress} />
                                )}
                            </div>
                        </Div>
                    )}

                    {data?.translations?.length === 0 && (
                        <Placeholder
                            icon={<Icon28HieroglyphCharacterOutline width={56} height={56} />}
                            header={"Нет переводов"}
                            children={"В этой коллекции пока нет переводов"}
                            action={
                                data.isEditable ? (
                                    <Button
                                        mode={"secondary"}
                                        size={"l"}
                                        before={<Icon24Add />}
                                        children={"Добавить перевод"}
                                        onClick={addTranslationToStackActionSheet.open}
                                    />
                                ) : undefined
                            }
                        />
                    )}

                    <Div className={"grid grid-cols-cards gap-3"}>
                        {!data &&
                            Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={
                                        "animate-pulse bg-vk-secondary rounded-xl h-[100px] w-full"
                                    }
                                />
                            ))}
                        {data?.translations?.map(({ translation }) => (
                            <TranslationCard
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
                                isWithMore={data.isEditable}
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

            <Spacing size={128} />

            <ModalWrapper
                isOpened={translationViewModal.isOpened}
                onClose={translationViewModal.close}
            >
                <ModalBody fullscreen>
                    {selectedTranslation && (
                        <TranslationView
                            id={selectedTranslation}
                            onClose={translationViewModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWindow
                isOpened={addTranslationToStackModal.isOpened}
                onClose={addTranslationToStackModal.close}
                title={"Добавить перевод"}
                fullscreen
            >
                <SearchTranslationToStack
                    onSelect={(translationId) => {
                        addTranslationToStackModal.close()
                        addTranslationToStack({ stackId: id, translationId })
                    }}
                    stackId={id}
                />
            </ModalWindow>

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

            <ModalWindow {...duplicateStackModal} title={"Дублирование коллекции"}>
                <DuplicateStack stackId={id} onSuccess={duplicateStackModal.close} />
            </ModalWindow>

            {showMore.isOpened && (
                <FloatingPortal>
                    <ActionSheet
                        mode={"sheet"}
                        onClose={showMore.close}
                        className={"z-30"}
                        toggleRef={undefined}
                    >
                        {data?.isEditable && (
                            <ActionSheetItem
                                before={<Icon28EditOutline />}
                                children={"Редактировать коллекцию"}
                                onClick={editStackModal.open}
                            />
                        )}
                        <ActionSheetItem
                            before={<Icon28ShareOutline />}
                            children={"Поделиться коллекцией"}
                            onClick={() => {
                                bridge.send("VKWebAppShare", {
                                    link: `https://vk.com/app51843841#/stack/${id}`,
                                })
                            }}
                        />
                        {currentUser?.canViewReports && !data?.isHiddenInFeed && (
                            <ActionSheetItem
                                before={<Icon28HideOutline />}
                                children={"Скрыть коллекцию из ленты"}
                                onClick={() => hide({ id })}
                            />
                        )}
                        {currentUser?.canViewReports && data?.isHiddenInFeed && (
                            <ActionSheetItem
                                before={<Icon28HideOutline />}
                                children={"Показать коллекцию в ленте"}
                                onClick={() => show({ id })}
                            />
                        )}
                        {data?.isEditable && (
                            <ActionSheetItem
                                before={<Icon28CopyOutline />}
                                children={"Дублировать коллекцию"}
                                onClick={duplicateStackModal.open}
                            />
                        )}
                        {data?.isEditable && (
                            <ActionSheetItem
                                before={<Icon28DeleteOutline />}
                                mode={"destructive"}
                                children={"Удалить коллекцию"}
                                onClick={deleteStackModal.open}
                            />
                        )}
                    </ActionSheet>
                </FloatingPortal>
            )}

            <ModalWindow {...duplicateStackModal} title={"Дублирование коллекции"}>
                <DuplicateStack
                    stackId={id}
                    onSuccess={() => {
                        duplicateStackModal.close()
                        stackDuplicatedSnackbar.open()
                    }}
                />
            </ModalWindow>

            {deleteStackModal.isOpened && (
                <FloatingPortal>
                    <Alert
                        className={"z-100"}
                        actions={[
                            {
                                title: "Отмена",
                                mode: "cancel",
                            },
                            {
                                title: "Удалить",
                                mode: "destructive",
                                action: () => {
                                    deleteStack({ id })
                                },
                            },
                        ]}
                        actionsLayout={"horizontal"}
                        onClose={deleteStackModal.close}
                        header={"Подтвердите действие"}
                        text={"Вы уверены, что хотите удалить коллекцию?"}
                    />
                </FloatingPortal>
            )}

            {addTranslationToStackActionSheet.isOpened && (
                <FloatingPortal>
                    <ActionSheet
                        onClose={addTranslationToStackActionSheet.close}
                        toggleRef={undefined}
                    >
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
                </FloatingPortal>
            )}

            {stackDuplicatedSnackbar.isOpened && (
                <Snackbar
                    onClose={stackDuplicatedSnackbar.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    children={"Коллекция продублирована в профиль"}
                />
            )}

            {translationAddedToStackSnackbar.isOpened && (
                <Snackbar
                    onClose={translationAddedToStackSnackbar.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    children={"Перевод добавлен в коллекцию"}
                />
            )}
        </>
    )
}
