import { Icon28CheckCircleOutline } from "@vkontakte/icons"
import {
    Avatar,
    Div,
    Group,
    Header,
    Link,
    ModalPageHeader,
    PanelHeaderBack,
    PanelHeaderContent,
    SimpleCell,
    Snackbar,
    WriteBar,
    WriteBarIcon,
} from "@vkontakte/vkui"
import { useCallback, useState } from "react"
import { DetailedTranslationCard } from "../entities/translation/ui/detailed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { plural } from "../shared/helpers/plural"
import { useModalState } from "../shared/hooks/useModalState"
import { Skeleton } from "../shared/ui/skeleton"
import { StackView } from "./stack-view"
import { TranslationAdd } from "./translation-add"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationComments } from "./translation-comments"

type TranslationViewModalProps = {
    id: number
    onClose?: () => void
}

export const TranslationView = ({ id, onClose }: TranslationViewModalProps) => {
    const { data, refetch } = trpc.translations.getSingle.useQuery({ id })

    const { mutate: react } = trpc.translations.addReaction.useMutation({
        onSuccess: () => refetch(),
    })

    const { mutate: unreact } = trpc.translations.removeReaction.useMutation({
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

            <Div>
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
                    onAddInStack={addToStack.open}
                    onEdit={editTranslation.open}
                    onDelete={onDelete}
                />
            </Div>

            <Group>
                <Header
                    children={`${data?.commentsCount} комментариев`}
                    aside={<Link children={"Показать все"} onClick={viewComments.open} />}
                />

                {data?.comments.map((comment) => (
                    <SimpleCell
                        key={comment.id}
                        // TODO fix
                        before={
                            <Avatar
                                size={32}
                                src={getSuitableAvatarUrl(comment.user.avatarUrls, 32)}
                            />
                        }
                        children={comment.user.firstName}
                        subtitle={comment.text}
                    />
                ))}

                <WriteBar
                    style={{ borderRadius: 12, flex: 1 }}
                    placeholder={"Комментарий"}
                    value={commentText}
                    onChange={({ currentTarget: { value } }) => setCommentText(value)}
                    readOnly={isAddingComment}
                    after={
                        commentText.length > 0 && (
                            <WriteBarIcon
                                mode={"send"}
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
            </Group>

            <Group>
                <Header children={"Больше интересного"} />

                <div style={{ height: 300 }} />
            </Group>

            <ModalWrapper isOpened={addToStack.isOpened} onClose={addToStack.close}>
                <ModalBody fullscreen={true}>
                    <TranslationAddToStack
                        onClose={addToStack.close}
                        onSuccess={(id) => {
                            addToStack.close()
                            setViewStackId(id)
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
                            }}
                            onClose={editTranslation.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            {addedTranslationToStack.isOpened && (
                <Snackbar
                    onClose={addedTranslationToStack.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    // action={"Открыть"}
                    // onActionClick={viewStack.open}
                    children={"Перевод добавлен в стопку"}
                />
            )}
        </>
    )
}
