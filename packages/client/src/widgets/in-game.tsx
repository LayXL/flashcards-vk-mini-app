import { Div, ModalPageHeader, PanelHeaderBack, Title } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { useCounter } from "usehooks-ts"
import { GameCard } from "../entities/game/ui/game-card"
import { RouterOutput, trpc } from "../shared/api"
import { Timer } from "../shared/ui/timer"

type InGameProps = {
    onStopGame: () => void
    onEndGame: () => void
    data: RouterOutput["game"]["start"]
}

export const InGame = ({ onStopGame, onEndGame, data }: InGameProps) => {
    const [cards, setCards] = useState<{ order: number; title: string; choices: string[] }[]>(
        data.cards
    )

    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const currentCardData = useMemo(() => cards[currentCardIndex], [cards, currentCardIndex])

    const correctAnswers = useCounter(0)
    const attempts = useCounter(data.gameSession.attemptsCount ?? 0)

    const withTimer = data.gameSession.gameDuration && data.gameSession.gameDuration > 0
    const withAttempts = data.gameSession.attemptsCount && data.gameSession.attemptsCount > 0
    const withRepeat = !!data.gameSession.repeatCards

    const [endsAt, setEndsAt] = useState<Date>(
        DateTime.now()
            .plus({ seconds: data.gameSession.gameDuration ?? 0 })
            .toJSDate()
    )

    const timer = useMemo(() => DateTime.fromJSDate(endsAt).diffNow().as("seconds"), [endsAt])

    const { mutate: answer } = trpc.game.answer.useMutation({
        onMutate: () => {
            setCurrentCardIndex((prev) => prev + 1)

            return {
                cardData: currentCardData,
            }
        },
        onSuccess: ({ status }, _, { cardData }) => {
            if (status === "correct") {
                correctAnswers.increment()

                if (
                    withTimer &&
                    data.gameSession.correctAnswerAddDuration &&
                    data.gameSession.type !== "ranked"
                ) {
                    setEndsAt((prev) =>
                        DateTime.fromJSDate(prev)
                            .plus({
                                seconds: (data.gameSession.correctAnswerAddDuration ?? 0) + 0.5,
                            })
                            .toJSDate()
                    )
                }
            } else {
                if (withAttempts) {
                    attempts.decrement()
                    if (attempts.count - 1 === 0) return onEndGame()
                }

                if (withRepeat) {
                    setCards((prev) => [...prev, cardData])
                    return
                }
            }

            if (currentCardIndex !== cards.length) return

            onEndGame()
        },
    })

    return (
        <div className={"flex-col min-h-screen"}>
            <ModalPageHeader before={<PanelHeaderBack onClick={onStopGame} />} children={"Игра"} />

            {withTimer && (
                <Div className={"flex-row justify-between items-center flex-1"}>
                    <div className={"flex-1"}>
                        <div
                            className={
                                "w-[60px] h-[80px] flex items-center justify-center shadow-card bg-vk-secondary rounded-xl"
                            }
                        >
                            <Title level={"2"} weight={"2"}>
                                {currentCardIndex + 1}/{data.cards.length}
                            </Title>
                        </div>
                    </div>

                    <Timer max={60} value={timer} onEnd={() => onEndGame()} />

                    <div className={"flex-1"}></div>
                </Div>
            )}

            {!withTimer && (
                <Div className={"flex-1"}>
                    {data.gameSession.repeatCards ? correctAnswers.count : currentCardIndex + 1}/
                    {data.cards.length}
                </Div>
            )}

            <Div>
                <GameCard
                    title={currentCardData?.title ?? ""}
                    choices={currentCardData?.choices ?? []}
                    onSelect={(choice) => {
                        answer({
                            order: currentCardData?.order ?? 0,
                            answer: currentCardData?.choices[choice] ?? "",
                        })
                    }}
                />
            </Div>
        </div>
    )
}
