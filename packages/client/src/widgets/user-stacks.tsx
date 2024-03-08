import { Icon24AddCircle, Icon24BookmarkOutline } from "@vkontakte/icons"
import {
    Avatar,
    Div,
    PanelSpinner,
    Spacing,
    SubnavigationBar,
    SubnavigationButton,
} from "@vkontakte/vkui"
import { useState } from "react"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { vibrateOnClick } from "../shared/helpers/vibrateOnClick"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"
import { StackView } from "./stack-view"

export const UserStacks = () => {
    const [filter, setFilter] = useState<RouterInput["stacks"]["getUserStacks"]["filter"]>("all")

    const { data: userInfo } = trpc.getUser.useQuery()

    const { data, isLoading } = trpc.stacks.getUserStacks.useQuery({
        filter,
    })

    const createStackModal = useModalState()

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    before={<Icon24AddCircle />}
                    children={"Создать"}
                    onClick={() => {
                        vibrateOnClick()
                        createStackModal.open()
                    }}
                />
                <SubnavigationButton
                    selected={filter === "saved"}
                    before={<Icon24BookmarkOutline />}
                    children={"Сохранённые"}
                    onClick={() => {
                        vibrateOnClick()
                        filter === "saved" ? setFilter("all") : setFilter("saved")
                    }}
                />
                <SubnavigationButton
                    selected={filter === "created"}
                    before={
                        <Avatar size={24} src={getSuitableAvatarUrl(userInfo?.avatarUrls, 32)} />
                    }
                    children={"Созданные мной"}
                    onClick={() => {
                        vibrateOnClick()
                        filter === "created" ? setFilter("all") : setFilter("created")
                    }}
                />
            </SubnavigationBar>

            <ModalWrapper isOpened={createStackModal.isOpened} onClose={createStackModal.close}>
                <ModalBody>
                    <StackCreateModal />
                </ModalBody>
            </ModalWrapper>

            {isLoading && <PanelSpinner />}

            {/* todo infinite scroll */}
            <Div
                className="grid grid-cols-cards gap-3"
                children={data?.items.map((stack) => (
                    <StackCardWithModal
                        key={stack.id}
                        id={stack.id}
                        name={stack.name}
                        translationsCount={stack.translationsCount}
                    />
                ))}
            />

            <Spacing size={256} />
        </>
    )
}

type StackCardWithModalProps = {
    id: number
    name: string
    translationsCount: number
}

const StackCardWithModal = ({ id, name, translationsCount }: StackCardWithModalProps) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <LargeStackCard
                title={name}
                translationsCount={translationsCount}
                onClick={() => {
                    vibrateOnClick()
                    open()
                }}
                // todo
                imageUrl=""
            />

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <StackView id={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
