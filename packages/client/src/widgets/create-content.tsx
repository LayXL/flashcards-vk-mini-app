import {
    Icon28Cards2Outline,
    Icon28CheckCircleOutline,
    Icon28HieroglyphCharacterOutline,
} from "@vkontakte/icons"
import { Div, Link, Snackbar, Subhead } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"
import { StackView } from "./stack-view"
import { TranslationAdd } from "./translation-add"
import { TranslationView } from "./translation-view"

type CreateContentProps = {
    isOpened: boolean
    setIsOpened: (value: boolean) => void
}

export const CreateContent = ({ isOpened, setIsOpened }: CreateContentProps) => {
    const createContentModal = useModalState(isOpened, {
        onClose: () => setIsOpened(false),
    })

    useEffect(() => {
        if (isOpened) {
            createContentModal.open()
        } else {
            createContentModal.close()
        }
    }, [createContentModal, isOpened])

    const createStackModal = useModalState(false, {
        onOpen: () => {
            vibrateOnClick()
            createContentModal?.close()
        },
    })

    const createTranslationModal = useModalState(false, {
        onOpen: () => {
            vibrateOnClick()
            createContentModal?.close()
        },
    })

    const createdStackSnackbar = useModalState()
    const createdTranslationSnackbar = useModalState()

    const createdStackViewModal = useModalState(false)
    const createdTranslationViewModal = useModalState(false)

    const [id, setId] = useState<number>()

    return (
        <>
            <ModalWindow {...createContentModal} title={"Что создаём?"}>
                <Div className={"flex gap-3"}>
                    <div
                        className={
                            "h-28 w-full rounded-xl bg-vk-secondary flex items-center flex-col justify-center gap-2 cursor-pointer press-scale"
                        }
                        onClick={createTranslationModal.open}
                    >
                        <div
                            className={
                                "size-14 flex items-center justify-center rounded-full bg-[#0077FF]"
                            }
                        >
                            <Icon28HieroglyphCharacterOutline />
                        </div>
                        <Subhead children={"Перевод"} weight={"2"} />
                    </div>
                    <div
                        className={
                            "h-28 w-full rounded-xl bg-vk-secondary flex items-center flex-col justify-center gap-2 cursor-pointer press-scale"
                        }
                        onClick={createStackModal.open}
                    >
                        <div
                            className={
                                "size-14 flex items-center justify-center rounded-full bg-learning-red"
                            }
                        >
                            <Icon28Cards2Outline />
                        </div>
                        <Subhead children={"Коллекция"} weight={"2"} />
                    </div>
                </Div>
            </ModalWindow>

            <ModalWindow {...createStackModal} disableDragToClose>
                <StackCreateModal
                    onClose={createStackModal.close}
                    onSuccess={(id) => {
                        setId(id)
                        createdStackSnackbar.open()
                    }}
                />
            </ModalWindow>

            <ModalWindow {...createTranslationModal} disableDragToClose>
                <TranslationAdd
                    onClose={createTranslationModal.close}
                    onAdd={(id) => {
                        setId(id)
                        createTranslationModal.close()
                        createdTranslationSnackbar.open()
                    }}
                />
            </ModalWindow>

            {createdStackSnackbar.isOpened && (
                <Snackbar
                    onClose={createdStackSnackbar.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    children={"Коллекция создана"}
                    after={
                        <Link
                            children={"Перейти"}
                            onClick={() => {
                                createdStackSnackbar.close()
                                createdStackViewModal.open()
                            }}
                        />
                    }
                />
            )}

            {createdTranslationSnackbar.isOpened && (
                <Snackbar
                    onClose={createdTranslationSnackbar.close}
                    before={<Icon28CheckCircleOutline fill={"var(--vkui--color_icon_positive)"} />}
                    children={"Перевод создан"}
                    after={
                        <Link
                            children={"Перейти"}
                            onClick={() => {
                                createdTranslationSnackbar.close()
                                createdTranslationViewModal.open()
                            }}
                        />
                    }
                />
            )}

            <ModalWindow {...createdStackViewModal} fullscreen>
                {id && <StackView id={id} onClose={createdStackViewModal.close} />}
            </ModalWindow>

            <ModalWindow {...createdTranslationViewModal} fullscreen>
                {id && <TranslationView id={id} onClose={createdTranslationViewModal.close} />}
            </ModalWindow>
        </>
    )
}
