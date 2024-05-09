import {
    Icon24Add,
    Icon24LikeOutline,
    Icon24UserOutline,
    Icon28HieroglyphCharacterOutline,
} from "@vkontakte/icons"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import {
    Button,
    ButtonGroup,
    Div,
    Placeholder,
    SubnavigationBar,
    SubnavigationButton,
} from "@vkontakte/vkui"
import { ComponentProps, useState } from "react"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { CreateContent } from "./create-content"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationView } from "./translation-view"

export const UserTranslations = () => {
    const routeNavigator = useRouteNavigator()
    // TODO rewrite
    const [filter, setFilter] =
        useState<RouterInput["translations"]["getUserTranslations"]["filter"]>("all")

    const {
        data: userTranslations,
        isLoading,
        isSuccess,
    } = trpc.translations.getUserTranslations.useQuery({
        filter,
    })

    const addTranslationModal = useModalState()

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    mode={"outline"}
                    before={<Icon24Add />}
                    children={"Создать"}
                    onClick={() => {
                        vibrateOnClick()
                        addTranslationModal.open()
                    }}
                />
                <SubnavigationButton
                    selected={filter === "liked"}
                    before={<Icon24LikeOutline />}
                    children={"Понравившиеся"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "liked" ? "all" : "liked")
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

            <Div className={"grid gap-3 grid-cols-cards"}>
                {isLoading &&
                    Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={"w-full h-[100px] animate-pulse bg-vk-secondary rounded-xl"}
                        />
                    ))}
                {userTranslations?.map((translation) => (
                    <TranslationCardWithModal
                        key={translation.id}
                        id={translation.id}
                        foreign={translation.foreign}
                        vernacular={translation.vernacular}
                    />
                ))}
            </Div>

            {isSuccess && userTranslations?.length === 0 && (
                <Placeholder
                    icon={<Icon28HieroglyphCharacterOutline width={56} height={56} />}
                    header={"У вас нет переводов"}
                    children={"Создайте свой первый перевод или добавьте из существующих"}
                    action={
                        <ButtonGroup mode={"vertical"} align={"center"}>
                            <Button
                                size={"l"}
                                mode={"secondary"}
                                children={"Создать перевод"}
                                onClick={addTranslationModal.open}
                            />
                            <Button
                                size={"l"}
                                mode={"tertiary"}
                                children={"Перейти в ленту"}
                                onClick={() => routeNavigator.push("/new")}
                            />
                        </ButtonGroup>
                    }
                />
            )}

            <CreateContent {...addTranslationModal} />
        </>
    )
}

type TranslationCardWithModalProps = Omit<
    ComponentProps<typeof TranslationCard>,
    "onAdd" | "onClick" | "onShowMore"
> & {
    id: number
}

const TranslationCardWithModal = ({ id, ...props }: TranslationCardWithModalProps) => {
    const addToStackModal = useModalState()
    const viewTranslation = useModalState()

    return (
        <>
            <TranslationCard
                onAdd={addToStackModal.open}
                onClick={viewTranslation.open}
                {...props}
            />

            <ModalWrapper isOpened={viewTranslation.isOpened} onClose={viewTranslation.close}>
                <ModalBody fullscreen>
                    <TranslationView id={id} onClose={viewTranslation.close} />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={addToStackModal.isOpened} onClose={addToStackModal.close}>
                <ModalBody fullscreen>
                    <TranslationAddToStack translationId={id} onClose={addToStackModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
