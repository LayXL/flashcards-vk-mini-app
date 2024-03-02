import { Button, Div, ModalPageHeader, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { useCallback, useMemo, useState } from "react"
import { GameCard } from "../entities/game/ui/game-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"

const GameResults = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const { data } = trpc.game.getGameResults.useQuery(id)

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Результат"}
            />

            <Div>
                {data?.translations.map((translation) => (
                    <div className="flex flex-col p-3">
                        <div>{translation.translation.foreign}</div>
                        <div>{translation.translation.vernacular}</div>
                        <div>{translation.status}</div>
                    </div>
                ))}
            </Div>
        </>
    )
}

export const Game = () => {
    const gameModal = useModalState()
    const gameResultsModal = useModalState()

    const {
        mutate: startGame,
        reset: resetGameData,
        isPending,
        data,
    } = trpc.game.start.useMutation({
        onSuccess: () => {
            gameModal.open()
        },
    })

    const { data: recentlyGames } = trpc.game.getRecentlyGames.useQuery()

    const { mutate: answer } = trpc.game.answer.useMutation({
        onSuccess: () => {
            if (currentCardIndex === data?.cards.length) return endGame()
        },
    })

    const stopGame = useCallback(() => {
        setCurrentCardIndex(0)
        gameModal.close()
        resetGameData()
    }, [gameModal, resetGameData])

    const endGame = useCallback(() => {
        gameModal.close()
        gameResultsModal.open()
    }, [gameModal, gameResultsModal])

    const [currentCardIndex, setCurrentCardIndex] = useState(0)

    const currentCardData = useMemo(
        () => data?.cards[currentCardIndex],
        [currentCardIndex, data?.cards],
    )

    return (
        <>
            <PanelHeader children={"Играть"} />

            <Div>
                <Button
                    loading={isPending}
                    stretched={true}
                    size={"l"}
                    children={"Начать"}
                    onClick={() => {
                        startGame({
                            stackIds: [1],
                        })
                    }}
                />
            </Div>

            <Div>
                {recentlyGames?.map((game) => (
                    <div className="p-3">{game.id}</div>
                ))}
            </Div>

            <TabBar />

            <ModalWrapper isOpened={gameModal.isOpened} onClose={stopGame}>
                <ModalBody fullscreen={true}>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={stopGame} />}
                        children={"Игра"}
                    />

                    <Div>
                        <GameCard
                            title={currentCardData?.title ?? ""}
                            choices={currentCardData?.choices ?? []}
                            onSelect={(choice) => {
                                answer({
                                    order: currentCardData?.order ?? 0,
                                    answer: currentCardData?.choices[choice] ?? "",
                                })

                                setCurrentCardIndex((prev) => prev + 1)
                            }}
                        />
                    </Div>
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
