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
import { useSetRecoilState } from "recoil"
import { DetailedTranslationCard } from "../entities/translation/ui/detailed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { useModalState } from "../shared/hooks/useModalState"
import { newTranslation } from "../shared/store"
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

    const modalHistory = useModalHistory()

    const setTranslationData = useSetRecoilState(newTranslation)

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
                    <DetailedTranslationCard />
                </Div>
                {/* <Group>
                    <SimpleCell subtitle={"На родном языке"} children={data?.vernacular} />
                    <SimpleCell subtitle={"На языке перевода"} children={data?.foreign} />
                    <SimpleCell subtitle={"Описание"} children={data?.foreignDescription} />
                    <SimpleCell subtitle={"Пример использования"} children={data?.example} />

                    <Div>
                        <ButtonGroup mode={"vertical"} stretched={true}>
                            <Button
                                size={"l"}
                                stretched={true}
                                children={data?.isReacted ? "Убрать лайк" : "Поставить лайк"}
                                onClick={toggleReaction}
                            />
                            <ButtonGroup stretched={true}>
                                <Button
                                    stretched={true}
                                    size={"l"}
                                    children={"Сохранить"}
                                    onClick={addToStack.open}
                                />
                                {data?.canEdit && (
                                    <Button
                                        size={"l"}
                                        before={<Icon24PenOutline />}
                                        onClick={() => {
                                            setTranslationData({
                                                isEditing: true,
                                                translationId: data?.id,
                                                vernacular: data?.vernacular ?? "",
                                                foreign: data?.foreign ?? "",
                                                foreignDescription: data?.foreignDescription ?? "",
                                                example: data?.example,
                                                tags: data?.tags?.map((x) => x.name) ?? [],
                                                transcriptions:
                                                    data?.transcriptions?.map((transcription) => ({
                                                        id: transcription.id,
                                                        transcription: transcription.transcription,
                                                        languageVariationId:
                                                            transcription.languageVariationId,
                                                    })) ?? [],
                                                languageId: data?.languageId,
                                                languageVariationId: data?.languageVariationId,
                                            })
                                            modalHistory.openModal("translationAdd")
                                        }}
                                    />
                                )}
                            </ButtonGroup>
                        </ButtonGroup>
                    </Div>
                </Group> */}

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
