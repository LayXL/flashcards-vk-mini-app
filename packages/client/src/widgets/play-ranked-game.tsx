import { Button, Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
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

    const startGame = useCallback(() => {
        start({ type: "ranked" })
    }, [start])

    const stopGame = useCallback(() => {
        gameModal.close()
    }, [gameModal])

    const endGame = useCallback(() => {
        gameModal.close()
        gameResultsModal.open()
    }, [gameModal, gameResultsModal])

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Приготовились"}
            />

            <Div className={"box-border fixed w-screen bottom-0 bg-vk-content"}>
                <Button children={"Играть"} stretched={true} onClick={startGame} size={"l"} />
                <div className={"h-[env(safe-area-inset-bottom)]"} />
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
