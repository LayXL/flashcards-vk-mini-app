import {
    Icon24Add,
    Icon24CheckCircleOn,
    Icon24LikeOutline,
    Icon24UserOutline,
} from "@vkontakte/icons"
import {
    Div,
    Link,
    PanelSpinner,
    Snackbar,
    Spacing,
    SubnavigationBar,
    SubnavigationButton,
} from "@vkontakte/vkui"
import { useState } from "react"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { useEncodeStackBackground } from "../shared/helpers/stackBackground"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"
import { StackView } from "./stack-view"

export const UserStacks = () => {
    const [filter, setFilter] = useState<RouterInput["stacks"]["getUserStacks"]["filter"]>("all")

    const { data, isLoading } = trpc.stacks.getUserStacks.useQuery({
        filter,
    })

    const encodeStackBackground = useEncodeStackBackground()

    const createStackModal = useModalState()
    const stackCreatedSnackbar = useModalState()
    const stackCreatedModal = useModalState()

    const [createdStackId, setCreatedStackId] = useState<number>()

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    before={<Icon24Add />}
                    children={"Создать"}
                    onClick={() => {
                        vibrateOnClick()
                        createStackModal.open()
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

            <ModalWrapper isOpened={createStackModal.isOpened} onClose={createStackModal.close}>
                <ModalBody>
                    <StackCreateModal
                        onClose={createStackModal.close}
                        onSuccess={(id) => {
                            stackCreatedSnackbar.open()
                            setCreatedStackId(id)
                        }}
                    />
                </ModalBody>
            </ModalWrapper>

            {stackCreatedSnackbar.isOpened && (
                <Snackbar
                    onClose={stackCreatedSnackbar.close}
                    before={<Icon24CheckCircleOn />}
                    children={"Стопка успешно создана"}
                    after={
                        <Link
                            children={"Перейти"}
                            onClick={() => {
                                stackCreatedSnackbar.close()
                                stackCreatedModal.open()
                            }}
                        />
                    }
                />
            )}

            {createdStackId && (
                <ModalWrapper
                    isOpened={stackCreatedModal.isOpened}
                    onClose={stackCreatedModal.close}
                >
                    <ModalBody>
                        <StackView id={createdStackId} />
                    </ModalBody>
                </ModalWrapper>
            )}

            {isLoading && <PanelSpinner />}

            {/* todo infinite scroll */}
            <Div
                className={"grid grid-cols-cards gap-3 grid-flow-dense auto-rows-[212px]"}
                children={data?.items.map((stack) => (
                    <StackCardWithModal
                        key={stack.id}
                        id={stack.id}
                        name={stack.name}
                        translationsCount={stack.translationsCount}
                        isVerified={stack.isVerified}
                        encodedBackground={encodeStackBackground(stack)}
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
    isVerified?: boolean
    encodedBackground?: string
}

const StackCardWithModal = ({
    id,
    name,
    translationsCount,
    isVerified,
    encodedBackground,
}: StackCardWithModalProps) => {
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
                isVerified={isVerified}
                // todo
                imageUrl={""}
                encodedBackground={encodedBackground}
            />

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <StackView id={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
