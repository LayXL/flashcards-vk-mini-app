import { Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { trpc } from "../shared/api"

type StackSelectProps = {
    onSelect: (id: number) => void
    onClose: () => void
}

export const StackSelect = ({ onClose, onSelect }: StackSelectProps) => {
    const { data } = trpc.stacks.getUserStacks.useQuery()

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children="Выберите стопку"
            />

            <Div className="flex-col gap-3">
                {data?.map((stack) => (
                    // TODO redesign
                    <div
                        key={stack.id}
                        className="p-3 bg-secondary cursor-pointer rounded-xl"
                        onClick={() => onSelect(stack.id)}
                    >
                        {stack.name}
                    </div>
                ))}
            </Div>
        </>
    )
}
