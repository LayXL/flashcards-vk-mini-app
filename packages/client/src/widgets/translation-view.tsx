import {
    Div,
    Button,
    SimpleCell,
    Group,
    ButtonGroup,
    WriteBar,
    WriteBarIcon,
    Avatar,
    PanelHeaderBack,
    PanelHeaderContent,
    Header,
    Link,
    PanelHeader,
} from "@vkontakte/vkui"
import { ModalBody } from "../features/modal/ui/modal-body"
import { trpc } from "../shared/api"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { useSetRecoilState } from "recoil"
import { newTranslation } from "../shared/store"
import { Icon24PenOutline } from "@vkontakte/icons"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { useModalState } from "../shared/hooks/useModalState"
import { useCallback, useState } from "react"

type TranslationViewModalProps = {
    id: number
    onClose?: () => void
}

export const TranslationView = ({ id, onClose }: TranslationViewModalProps) => {
    const { data, refetch } = trpc.translations.getSingle.useQuery({ id })
    const { isOpened, close, open } = useModalState(false)
    const [commentText, setCommentText] = useState("")

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

    const toggleReaction = useCallback(() => {
        return data?.isReacted ? unreact({ translationId: id }) : react({ translationId: id })
    }, [data?.isReacted, id, react, unreact])

    const modalHistory = useModalHistory()

    const setTranslationData = useSetRecoilState(newTranslation)

    return (
        <>
            <ModalBody>
                <PanelHeader before={<PanelHeaderBack onClick={onClose} />}>
                    <PanelHeaderContent
                        before={<Avatar size={36} />}
                        status={"n переводов"}
                        children={data?.author.id}
                    />
                </PanelHeader>

                <Group>
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
                                    onClick={open}
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
                </Group>

                <Group>
                    <Header
                        children={`${data?.commentsCount} комментариев`}
                        aside={<Link children={"Показать все"} />}
                    />

                    {data?.comments.map((x) => (
                        <SimpleCell
                            before={<Avatar size={32} />}
                            children={x.user.vkId}
                            subtitle={x.text}
                        />
                    ))}

                    <Div style={{ display: "flex", gap: 12 }}>
                        <Avatar size={52} />
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
                    </Div>
                </Group>

                <Group>
                    <Header children={"Больше интересного"} />

                    <div style={{ height: 300 }} />
                </Group>
            </ModalBody>

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <TranslationAddToStack onClose={close} translationId={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
