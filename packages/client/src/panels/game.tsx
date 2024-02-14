import { Button, Div, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useStep } from "usehooks-ts"
import { useCallback, useMemo, useState } from "react"
import { GameCard } from "../entities/game/ui/game-card"

export const Game = () => {
    const [currentStep, { setStep }] = useStep(3)

    const {
        mutate: startGame,
        reset: resetGameData,
        isPending,
        data,
    } = trpc.game.start.useMutation({
        onSuccess: () => setStep(2),
    })

    const stopGame = useCallback(() => {
        setStep(1)
        setCurrentCardIndex(0)
        resetGameData()
    }, [resetGameData, setStep])

    const [currentCardIndex, setCurrentCardIndex] = useState(0)

    const currentCardData = useMemo(
        () => data?.cards[currentCardIndex],
        [currentCardIndex, data?.cards],
    )

    switch (currentStep) {
        case 1:
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
                                startGame({})
                            }}
                        />
                    </Div>

                    <TabBar />
                </>
            )
        case 2:
            return (
                <>
                    <PanelHeader
                        before={<PanelHeaderBack onClick={stopGame} />}
                        children={"Игра"}
                    />

                    <Div>
                        <GameCard
                            title={currentCardData?.title ?? ""}
                            choices={currentCardData?.choices ?? []}
                            onSelect={() => {
                                if (currentCardIndex === (data?.cards.length ?? 0) - 1) {
                                    setStep(3)
                                } else {
                                    setCurrentCardIndex(currentCardIndex + 1)
                                }
                            }}
                        />
                    </Div>
                </>
            )
        case 3:
            return (
                <>
                    <PanelHeader
                        before={<PanelHeaderBack onClick={stopGame} />}
                        children={"Результаты"}
                    />

                    <Div></Div>

                    <TabBar />
                </>
            )
    }
}
