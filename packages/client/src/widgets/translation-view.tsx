import { Icon24Send, Icon28CheckCircleOutline } from "@vkontakte/icons"
import {
    Avatar,
    Div,
    Group,
    Header,
    Headline,
    Input,
    Link,
    ModalPageHeader,
    PanelHeaderBack,
    PanelHeaderContent,
    SimpleCell,
    Snackbar,
} from "@vkontakte/vkui"
import { useCallback, useState } from "react"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { DetailedTranslationCard } from "../entities/translation/ui/detailed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { plural } from "../shared/helpers/plural"
import { vibrateOnSuccess } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { Skeleton } from "../shared/ui/skeleton"
import { ReportCreate } from "./report-create"
import { StackView } from "./stack-view"
import { TranslationAdd } from "./translation-add"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationComments } from "./translation-comments"

type TranslationViewModalProps = {
    id: number
    onClose?: () => void
}

export const TranslationView = ({ id, onClose }: TranslationViewModalProps) => {
    const { data, refetch, isLoading } = trpc.translations.getSingle.useQuery({ id })
    const { data: currentUser } = trpc.getUser.useQuery()

    const { mutate: react } = trpc.translations.addReaction.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: unreact } = trpc.translations.removeReaction.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: hide } = trpc.translations.hide.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: show } = trpc.translations.show.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: addComment, isPending: isAddingComment } =
        trpc.translations.addComment.useMutation({
            onSuccess: () => {
                refetch()
                setCommentText("")
            },
        })

    const addToStack = useModalState(false)
    const viewComments = useModalState(false)
    const viewStack = useModalState(false)
    const editTranslation = useModalState(false)
    const addedTranslationToStack = useModalState(false)
    const reportTranslationModal = useModalState(false)
    const onSuccessReportSnackbar = useModalState(false)

    const [commentText, setCommentText] = useState("")

    const [viewStackId, setViewStackId] = useState<number | null>(null)

    const toggleReaction = useCallback(() => {
        return data?.isReacted ? unreact({ translationId: id }) : react({ translationId: id })
    }, [data?.isReacted, id, react, unreact])

    // TODO finalize
    const onDelete = () => {}

    return (
        <>
            <ModalPageHeader before={<PanelHeaderBack onClick={onClose} />}>
                <PanelHeaderContent
                    before={
                        <Avatar size={36} src={getSuitableAvatarUrl(data?.author.avatarUrls, 32)} />
                    }
                    children={data?.author.firstName || <Skeleton className={"w-10"} />}
                    // TODO finalize
                    status={plural(data?.authorTranslationsCount ?? 0, [
                        "перевод",
                        "перевода",
                        "переводов",
                    ])}
                />
            </ModalPageHeader>
            <Group>
                <Div className={"pt-0"}>
                    <DetailedTranslationCard
                        id={data?.id}
                        vernacular={data?.vernacular}
                        foreign={data?.foreign}
                        languageVariationIcon={data?.languageVariation?.iconUrl}
                        transcriptions={data?.transcriptions.map((transcription) => ({
                            transcription: transcription.transcription,
                            icon: transcription.languageVariation?.iconUrl,
                        }))}
                        tags={data?.tags.map((tag) => tag.name)}
                        example={data?.example}
                        onReactClick={toggleReaction}
                        isReacted={data?.isReacted}
                        reactionsCount={data?.reactionsCount}
                        onAddInStack={addToStack.open}
                        onEdit={data?.canEdit ? editTranslation.open : undefined}
                        onDelete={data?.canEdit ? onDelete : undefined}
                        onReport={data?.canEdit ? undefined : reportTranslationModal.open}
                        onHide={
                            currentUser?.canViewReports && !data?.isHiddenInFeed
                                ? () => hide({ id })
                                : undefined
                        }
                        onShow={
                            currentUser?.canViewReports && data?.isHiddenInFeed
                                ? () => show({ id })
                                : undefined
                        }
                    />
                </Div>

                {data?.foreignDescription && (
                    <Div className={"pb-0"}>
                        <Headline children={data?.foreignDescription} />
                    </Div>
                )}
            </Group>
            {!data?.isPrivate && (
                <Group>
                    <Header
                        children={
                            isLoading
                                ? "Комментарии"
                                : (data?.commentsCount ?? 0) > 0
                                ? plural(data?.commentsCount ?? 0, [
                                      "комментарий",
                                      "комментария",
                                      "комментариев",
                                  ])
                                : "Нет комментариев"
                        }
                        aside={
                            data?.commentsCount ? (
                                <Link children={"Показать все"} onClick={viewComments.open} />
                            ) : null
                        }
                    />

                    {data?.comments.map((comment) => (
                        <SimpleCell
                            key={comment.id}
                            before={
                                <Avatar
                                    size={32}
                                    src={getSuitableAvatarUrl(comment.user.avatarUrls, 32)}
                                />
                            }
                            subtitle={comment.user.firstName}
                            children={comment.text}
                        />
                    ))}

                    <Div>
                        <Input
                            value={commentText}
                            onChange={({ currentTarget: { value } }) => setCommentText(value)}
                            placeholder={"Оставьте комментарий"}
                            readOnly={isAddingComment}
                            after={
                                commentText.length > 0 && (
                                    <Icon24Send
                                        className={"text-accent cursor-pointer"}
                                        onClick={() =>
                                            addComment({
                                                translationId: id,
                                                text: commentText,
                                            })
                                        }
                                    />
                                )
                            }
                        />
                    </Div>
                </Group>
            )}

            {(data?.stacks.length ?? 0) > 0 && (
                <Group>
                    <Header children={"Стопки с этим переводом"} />
                    <Div className={"grid-cols-cards grid gap-3"}>
                        {data?.stacks.map((stack) => (
                            <LargeStackCard
                                title={stack.name}
                                translationsCount={stack.translationsCount}
                                encodedBackground={stack.encodedBackground}
                                isVerified={stack.isVerified}
                                onClick={() => {
                                    setViewStackId(stack.id)
                                    viewStack.open()
                                }}
                            />
                        ))}
                    </Div>
                </Group>
            )}

            <ModalWrapper isOpened={addToStack.isOpened} onClose={addToStack.close}>
                <ModalBody fullscreen={true}>
                    <TranslationAddToStack
                        onClose={addToStack.close}
                        onSuccess={(id) => {
                            addToStack.close()
                            setViewStackId(id ?? null)
                            addedTranslationToStack.open()
                        }}
                        translationId={id}
                    />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={viewComments.isOpened} onClose={viewComments.close}>
                <ModalBody>
                    <TranslationComments onClose={viewComments.close} translationId={id} />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={viewStack.isOpened} onClose={viewStack.close}>
                <ModalBody fullscreen={true}>
                    {viewStackId && <StackView id={viewStackId} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={editTranslation.isOpened} onClose={editTranslation.close}>
                <ModalBody>
                    {data && (
                        <TranslationAdd
                            defaultValues={{
                                id: data.id,
                                languageVariationId: data.languageVariationId ?? undefined,
                                foreign: data.foreign,
                                vernacular: data.vernacular,
                                languageId: data.languageId,
                                example: data.example ?? undefined,
                                foreignDescription: data.foreignDescription ?? undefined,
                                tags: data.tags.map(({ name }) => name),
                                transcriptions: data.transcriptions,
                                isPrivate: data.isPrivate,
                            }}
                            onClose={editTranslation.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWindow {...reportTranslationModal} fullscreen={false} title={"Пожаловаться"}>
                <ReportCreate
                    translationId={id}
                    onReport={() => {
                        onSuccessReportSnackbar.open()
                        reportTranslationModal.close()
                        vibrateOnSuccess()
                    }}
                />
            </ModalWindow>

            {onSuccessReportSnackbar.isOpened && (
                <Snackbar
                    onClose={onSuccessReportSnackbar.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    children={"Жалоба отправлена, спасибо за помощь!"}
                />
            )}

            {addedTranslationToStack.isOpened && (
                <Snackbar
                    onClose={addedTranslationToStack.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    // action={"Открыть"}
                    // onActionClick={viewStack.open}
                    children={
                        viewStackId ? "Перевод добавлен в стопку" : "Перевод сохранён в избранное"
                    }
                />
            )}
        </>
    )
}
