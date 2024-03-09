import { Icon24Add, Icon24LikeOutline, Icon24UserOutline } from "@vkontakte/icons"
import { Div, PanelSpinner, Spacing, SubnavigationBar, SubnavigationButton } from "@vkontakte/vkui"
import { ComponentProps, useState } from "react"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { vibrateOnClick } from "../shared/helpers/vibrateOnClick"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationAdd } from "./translation-add"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationView } from "./translation-view"

export const UserTranslations = () => {
    // TODO rewrite
    const [filter, setFilter] = useState<RouterInput["stacks"]["getUserStacks"]["filter"]>("all")

    const { data: userTranslations, isLoading } = trpc.translations.getUserTranslations.useQuery()

    const addTranslationModal = useModalState()

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    before={<Icon24Add />}
                    children={"Создать"}
                    onClick={() => {
                        vibrateOnClick()
                        addTranslationModal.open()
                    }}
                />
                <SubnavigationButton
                    selected={filter === "saved"}
                    before={<Icon24LikeOutline />}
                    children={"Понравившиеся"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "saved" ? "all" : "saved")
                    }}
                />
                <SubnavigationButton
                    selected={filter === "created"}
                    before={<Icon24UserOutline />}
                    children={"Созданные мной"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "created" ? "all" : "created")
                    }}
                />
            </SubnavigationBar>

            {isLoading && <PanelSpinner />}

            <Div className="grid gap-3 grid-cols-cards">
                {userTranslations?.map((translation) => (
                    <TranslationCardWithModal
                        key={translation.id}
                        id={translation.id}
                        foreign={translation.foreign}
                        vernacular={translation.vernacular}
                    />
                ))}
            </Div>

            <Spacing size={256} />

            <ModalWrapper
                isOpened={addTranslationModal.isOpened}
                onClose={addTranslationModal.close}
            >
                <ModalBody>
                    <TranslationAdd onClose={addTranslationModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}

type TranslationCardWithModalProps = Omit<
    ComponentProps<typeof FeedTranslationCard>,
    "onAdd" | "onClick" | "onShowMore"
> & {
    id: number
}

const TranslationCardWithModal = ({ id, ...props }: TranslationCardWithModalProps) => {
    const addToStackModal = useModalState()
    const viewTranslation = useModalState()

    return (
        <>
            <FeedTranslationCard
                onAdd={addToStackModal.open}
                onClick={viewTranslation.open}
                {...props}
            />

            <ModalWrapper isOpened={viewTranslation.isOpened} onClose={viewTranslation.close}>
                <ModalBody>
                    <TranslationView id={id} onClose={viewTranslation.close} />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={addToStackModal.isOpened} onClose={addToStackModal.close}>
                <ModalBody>
                    <TranslationAddToStack translationId={id} onClose={addToStackModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
