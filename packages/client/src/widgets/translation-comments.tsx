import {
    PanelHeader,
    PanelHeaderBack,
    Avatar,
    SimpleCell,
    WriteBar,
    WriteBarIcon,
    Div,
    FixedLayout,
    Group,
    ModalPageHeader,
} from "@vkontakte/vkui"
import { trpc } from "../shared/api"
import { useState } from "react"
import { FloatingPortal } from "@floating-ui/react"
import { motion } from "framer-motion"

type TranslationCommentsProps = {
    translationId: number
    onClose: () => void
}

export const TranslationComments = ({ translationId: id, onClose }: TranslationCommentsProps) => {
    const { data, refetch } = trpc.translations.getComments.useQuery({ translationId: id })

    const [commentText, setCommentText] = useState("")

    const { mutate: addComment, isPending: isAddingComment } =
        trpc.translations.addComment.useMutation({
            onSuccess: () => {
                refetch()
                setCommentText("")
            },
        })

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Комментарии"}
            />

            <Group>
                {data?.map((comment) => (
                    <SimpleCell
                        // TODO fix
                        before={<Avatar size={32} src={comment.user.avatarUrls["100"]} />}
                        children={comment.user.firstName}
                        subtitle={comment.text}
                    />
                ))}
            </Group>

            <Group>
                <div style={{ height: 54 }} />
            </Group>

            <FloatingPortal>
                <motion.div
                    initial={{ translateY: "100%" }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: "100%" }}
                    style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
                >
                    <Div>
                        <WriteBar
                            style={{ borderRadius: 12 }}
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
                </motion.div>
            </FloatingPortal>
        </>
    )
}
