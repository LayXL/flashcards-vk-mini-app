import { ModalPageHeader, Div, Button, SimpleCell, Group, ButtonGroup } from "@vkontakte/vkui"
import { ModalBody } from "../features/modal/ui/modal-body"
import { trpc } from "../shared/api"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { useSetRecoilState } from "recoil"
import { newTranslation } from "../shared/store"
import { Icon24PenOutline } from "@vkontakte/icons"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { useModalState } from "../shared/hooks/useModalState"
import { useCallback } from "react"

type TranslationViewModalProps = {
    id: number
}

export const TranslationViewModal = ({ id }: TranslationViewModalProps) => {
    const { setData } = trpc.useUtils().translations.getSingle

    const { data, refetch } = trpc.translations.getSingle.useQuery({ id })
    const { isOpened, close, open } = useModalState(false)

    const { mutate: react } = trpc.translations.addReaction.useMutation({
        onSuccess: () => {
            setData({ id }, (prev) =>
                prev === undefined ? undefined : { ...prev, isReacted: true },
            )
            refetch()
        },
    })
    const { mutate: unreact } = trpc.translations.removeReaction.useMutation({
        onSuccess: () => {
            setData({ id }, (prev) =>
                prev === undefined ? undefined : { ...prev, isReacted: false },
            )
            refetch()
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
                <ModalPageHeader children={"Перевод"} />

                <Group>
                    <SimpleCell subtitle={"На родном языке"} children={data?.vernacular} />
                    <SimpleCell subtitle={"На языке перевода"} children={data?.foreign} />
                    <SimpleCell subtitle={"Описание"} children={data?.foreignDescription} />
                    <SimpleCell subtitle={"Пример использования"} children={data?.example} />
                </Group>

                <Div>
                    <Button
                        size={"l"}
                        stretched={true}
                        children={data?.isReacted ? "Убрать лайк" : "Поставить лайк"}
                        onClick={toggleReaction}
                    />
                </Div>

                <Group>
                    <Div>
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
                    </Div>
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
