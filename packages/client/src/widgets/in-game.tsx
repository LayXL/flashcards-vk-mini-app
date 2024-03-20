import { Div, ModalPageHeader, PanelHeaderBack, Title } from "@vkontakte/vkui"
import { useEffect, useMemo, useState } from "react"
import { useCountdown, useCounter } from "usehooks-ts"
import { GameCard } from "../entities/game/ui/game-card"
import { RouterOutput, trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { useTransform } from "../shared/hooks/useTransform"

type InGameProps = {
    onStopGame: () => void
    onEndGame: () => void
    data: RouterOutput["game"]["start"]
}

export const InGame = ({ onStopGame, onEndGame, data }: InGameProps) => {
    const [cards, setCards] = useState<{ order: number; title: string; choices: string[] }[]>(
        data.cards,
    )

    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const currentCardData = useMemo(() => cards[currentCardIndex], [cards, currentCardIndex])

    const correctAnswers = useCounter(0)
    const attempts = useCounter(data.gameSession.attemptsCount ?? 0)

    // todo refactor to timer component
    const [duration, setDuration] = useState((data.gameSession.gameDuration ?? 0) * 10)
    const [count, { startCountdown }] = useCountdown({
        countStart: duration,
        intervalMs: 5,
    })
    const strokeOffset = useTransform(
        count,
        [(data.gameSession.gameDuration ?? 0) * 10, 0],
        [0, 502.6548245744],
    )

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

                if (withTimer) {
                    setDuration(count + (data.gameSession.correctAnswerAddDuration ?? 0) * 10)
                    startCountdown()
                }
            } else {
                if (data.gameSession.attemptsCount) {
                    attempts.decrement()
                }

                if (data.gameSession.repeatCards) {
                    setCards((prev) => [...prev, cardData])
                    return
                }
            }

            if (currentCardIndex !== cards.length) return

            onEndGame()
        },
    })

    const withTimer = data.gameSession.gameDuration && data.gameSession.gameDuration > 0
    const withAttempts = data.gameSession.attemptsCount && data.gameSession.attemptsCount > 0

    useEffect(() => {
        console.log(true)

        if (withTimer && count === 0) {
            console.log(true)

            onEndGame()
        }
    }, [count, onEndGame, withTimer])

    useEffect(() => {
        if (withAttempts && attempts.count === 0) {
            onEndGame()
        }
    }, [attempts.count, onEndGame, withAttempts])

    useEffect(() => {
        if (!withTimer) return
        startCountdown()
    }, [data.gameSession.gameDuration, withTimer, startCountdown])

    return (
        <div className={"flex-col min-h-screen"}>
            <ModalPageHeader before={<PanelHeaderBack onClick={onStopGame} />} children={"Игра"} />

            {withTimer && (
                <Div className={"flex-row justify-between items-center flex-1"}>
                    <div
                        className={
                            "w-[60px] h-[80px] flex items-center justify-center shadow-card bg-vk-secondary rounded-xl"
                        }
                    >
                        <Title level={"2"} weight={"2"}>
                            {currentCardIndex + 1}/{data.cards.length}
                        </Title>
                    </div>

                    {withTimer && (
                        <div className={"relative w-[160px] h-[160px]"}>
                            <svg
                                className={cn(
                                    "absolute inset-0 rounded-full -rotate-90 text-accent transition-colors",
                                    count <= 50 && "text-dynamic-red",
                                )}
                                width={"160"}
                                height={"160"}
                                viewBox={"0 0 160 160"}
                                fill={"none"}
                                xmlns={"http://www.w3.org/2000/svg"}
                            >
                                <circle
                                    cx={"80"}
                                    cy={"80"}
                                    r={"80"}
                                    fill={"none"}
                                    stroke={"currentColor"}
                                    strokeWidth={"16"}
                                    strokeDasharray={"502,6548245744"}
                                    strokeDashoffset={strokeOffset}
                                ></circle>
                            </svg>
                            <div
                                className={
                                    "absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-vk-secondary size-[144px] rounded-full flex-col gap-2.5 items-center justify-center"
                                }
                            >
                                <span className={"text-[40px] leading-none font-semibold"}>
                                    {Math.floor(count / 10)}
                                </span>
                                <span className={"text-[20px] leading-none font-semibold"}>
                                    сек
                                </span>
                            </div>
                        </div>
                    )}
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
