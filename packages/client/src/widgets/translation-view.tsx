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
    WriteBar,
    WriteBarIcon,
} from "@vkontakte/vkui"
import { useCallback, useState } from "react"
import { DetailedTranslationCard } from "../entities/translation/ui/detailed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { useModalState } from "../shared/hooks/useModalState"
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
    const [commentText, setCommentText] = useState("")

    const toggleReaction = useCallback(() => {
        return data?.isReacted ? unreact({ translationId: id }) : react({ translationId: id })
    }, [data?.isReacted, id, react, unreact])

    return (
        <>
            <ModalBody>
                <ModalPageHeader before={<PanelHeaderBack onClick={onClose} />}>
                    <PanelHeaderContent
                        // TODO fix
                        before={
                            <Avatar
                                size={36}
                                src={getSuitableAvatarUrl(data?.author.avatarUrls, 32)}
                            />
                        }
                        status={"n переводов"}
                        children={data?.author.firstName}
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
                    />
                </Div>

                <Group>
                    <Header
                        children={`${data?.commentsCount} комментариев`}
                        aside={<Link children={"Показать все"} onClick={viewComments.open} />}
                    />

                    {data?.comments.map((comment) => (
                        <SimpleCell
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
            </ModalBody>

            <ModalWrapper isOpened={addToStack.isOpened} onClose={addToStack.close}>
                <ModalBody fullscreen={true}>
                    <TranslationAddToStack onClose={addToStack.close} translationId={id} />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={viewComments.isOpened} onClose={viewComments.close}>
                <ModalBody>
                    <TranslationComments onClose={viewComments.close} translationId={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
