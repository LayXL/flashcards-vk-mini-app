import { Button, Div, PanelHeader } from "@vkontakte/vkui"
import { useCallback } from "react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "../widgets/game-results"
import { InGame } from "../widgets/in-game"

const RecentGameCard = ({ id }: { id: number }) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <div onClick={open} className="p-3 bg-secondary rounded-xl cursor-pointer">
                {id}
            </div>

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <GameResults id={id} onClose={close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}

export const Game = () => {
    const gameModal = useModalState()
    const gameResultsModal = useModalState()

    const {
        mutate: start,
        reset: resetGameData,
        isPending,
        data,
    } = trpc.game.start.useMutation({
        onSuccess: () => {
            gameModal.open()
        },
    })

    const { data: recentlyGames } = trpc.game.getRecentlyGames.useQuery()

    const startGame = useCallback(() => {
        start({
            stackIds: [1],
            gameDuration: 60,
            correctAnswerAddDuration: 1,
        })
    }, [start])

    const stopGame = useCallback(() => {
        gameModal.close()
        resetGameData()
    }, [gameModal, resetGameData])

    const endGame = useCallback(() => {
        gameModal.close()
        gameResultsModal.open()
    }, [gameModal, gameResultsModal])

    return (
        <>
            <PanelHeader children={"Играть"} />

            <Div>
                <Button
                    loading={isPending}
                    stretched={true}
                    size={"l"}
                    children={"Начать"}
                    onClick={startGame}
                />
            </Div>

            <Div className="flex-col gap-2">
                {recentlyGames?.map((game) => (
                    <RecentGameCard key={game.id} id={game.id} />
                ))}
            </Div>

            <TabBar />

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
