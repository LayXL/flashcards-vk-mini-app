import { Button, Div, ModalPageHeader, PanelHeaderBack, Text, Title } from "@vkontakte/vkui"
import { useCallback } from "react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "./game-results"
import { InGame } from "./in-game"

type PlayRankedGameProps = {
    onClose?: () => void
}

export const PlayRankedGame = ({ onClose }: PlayRankedGameProps) => {
    const gameModal = useModalState()
    const gameResultsModal = useModalState()

    const { mutate: start, data } = trpc.game.start.useMutation({
        onSuccess: () => {
            gameModal.open()
        },
    })

    const { mutate: end } = trpc.game.end.useMutation()

    const startGame = useCallback(() => {
        start({ type: "ranked" })
    }, [start])

    const stopGame = useCallback(() => {
        gameModal.close()
    }, [gameModal])

    const endGame = useCallback(() => {
        end()
        gameModal.close()
        gameResultsModal.open()
    }, [end, gameModal, gameResultsModal])

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Приготовились"}
            />

            <div className={"h-full flex-col justify-center"}>
                <Div className={"flex flex-col gap-2"}>
                    <Title children={"Как играть?"} />
                    <Text children={"Сам не знаю..."} />
                </Div>
            </div>

            <Div className={"box-border fixed w-full bottom-0 bg-vk-content"}>
                <Button children={"Играть"} stretched={true} onClick={startGame} size={"l"} />
                <div className={"h-inset-bottom"} />
            </Div>

            <ModalWrapper isOpened={gameModal.isOpened} onClose={stopGame}>
                <ModalBody fullscreen={true}>
                    {data && <InGame onEndGame={endGame} onStopGame={stopGame} data={data} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={gameResultsModal.isOpened} onClose={gameResultsModal.close}>
                <ModalBody fullscreen={true}>
                    <GameResults id={data?.gameSession.id ?? 0} onClose={gameResultsModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
