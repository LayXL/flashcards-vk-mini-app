import { CellButton, Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { Fragment } from "react"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { useModal } from "../features/modal/contexts/modal-context"
import { trpc } from "../shared/api"

type StackViewProps = {
    id: number
}

export const StackView = ({ id }: StackViewProps) => {
    const modal = useModal()
    const { data, refetch } = trpc.stacks.getSingle.useQuery({ id })

    const { mutate: deleteTranslationFromStack } = trpc.stacks.removeTranslation.useMutation({
        onSuccess: () => refetch(),
    })

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={() => modal?.onClose()} />}
                children={data?.name}
            />

            {data?.description && <Div>{data?.description}</Div>}

            <Div>
                {data?.translations.map(({ translation }) => (
                    <Fragment key={translation.id}>
                        <TranslationCard
                            id={translation.id}
                            key={translation.id}
                            vernacular={translation.vernacular}
                            foreign={translation.foreign}
                        />
                        <CellButton
                            onClick={() =>
                                deleteTranslationFromStack({
                                    translationId: translation.id,
                                    stackId: id,
                                })
                            }
                            mode={"danger"}
                            children={"Убрать перевод из стопки"}
                        />
                    </Fragment>
                ))}
            </Div>
        </>
    )
}
