import { Button, Div } from "@vkontakte/vkui"
import { trpc } from "../shared/api"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { useState } from "react"
import { StackCreateModal } from "./stack-create-modal"
import { StackCard } from "../entities/stack/ui/stack-card"

export const UserStacks = () => {
    const { data } = trpc.stacks.getUserStacks.useQuery()

    const [isOpened, setIsOpened] = useState(false)

    return (
        <>
            <Div>
                <Button
                    stretched={true}
                    size={"l"}
                    children={"Добавить стопку"}
                    onClick={() => setIsOpened(true)}
                />
            </Div>

            <ModalWrapper isOpened={isOpened} onClose={() => setIsOpened(false)}>
                <StackCreateModal />
            </ModalWrapper>

            <Div>
                {data?.map((stack) => (
                    <StackCard key={stack.id} id={stack.id} name={stack.name} />
                ))}
            </Div>
        </>
    )
}
