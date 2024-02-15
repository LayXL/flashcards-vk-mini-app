import { Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { trpc } from "../shared/api"
import { useModal } from "../features/modal/contexts/modal-context"
import { TranslationCard } from "../entities/translation/ui/translation-card"

type StackViewProps = {
    id: number
}

export const StackView = ({ id }: StackViewProps) => {
    const modal = useModal()
    const { data } = trpc.stacks.getSingle.useQuery({ id })

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={() => modal?.onClose()} />}
                children={data?.name}
            />

            {data?.description && <Div>{data?.description}</Div>}

            <Div>
                {data?.translations.map(({ translation }) => (
                    <TranslationCard
                        id={translation.id}
                        key={translation.id}
                        vernacular={translation.vernacular}
                        foreign={translation.foreign}
                    />
                ))}
            </Div>
        </>
    )
}
