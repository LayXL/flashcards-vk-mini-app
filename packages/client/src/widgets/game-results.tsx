import { Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { trpc } from "../shared/api"

type GameResultsProps = {
    id: number
    onClose: () => void
}

export const GameResults = ({ id, onClose }: GameResultsProps) => {
    const { data } = trpc.game.getGameResults.useQuery(id)

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Результат"}
            />

            <Div>
                <p>{(data?.answerAccuracy ?? 0) * 100}%</p>
                <p>{data?.startedAt}</p>
            </Div>

            <Div className="flex-col gap-2">
                {data?.translations?.map((translation) => (
                    <div
                        className="flex flex-col p-3 bg-secondary rounded-xl shadow-card"
                        key={translation.translationId}
                    >
                        <div>{translation.translation.foreign}</div>
                        <div>{translation.translation.vernacular}</div>
                        <div>{translation.status}</div>
                    </div>
                ))}
            </Div>
        </>
    )
}
