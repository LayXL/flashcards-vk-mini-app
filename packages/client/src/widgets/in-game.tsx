import { Icon32CheckbitOutline } from "@vkontakte/icons"
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
    const [currentCardIndex, setCurrentCardIndex] = useState(0)

    const correctAnswers = useCounter(0)

    const [duration, setDuration] = useState((data.gameSession.gameDuration ?? 0) * 10)

    const [count, { startCountdown }] = useCountdown({
        countStart: duration,
        intervalMs: 100,
    })

    const strokeOffset = useTransform(count, [duration, 0], [0, 502.6548245744])

    const currentCardData = useMemo(
        () => data?.cards[currentCardIndex],
        [currentCardIndex, data?.cards],
    )

    const { mutate: answer } = trpc.game.answer.useMutation({
        onMutate: () => {
            setCurrentCardIndex((prev) => prev + 1)
        },
        onSuccess: ({ status }) => {
            if (status === "correct") {
                correctAnswers.increment()

                setDuration(count + (data.gameSession.correctAnswerAddDuration ?? 0) * 10)
                startCountdown()
            }

            if (currentCardIndex !== data?.cards.length) return

            onEndGame()
        },
    })

    useEffect(() => {
        if (count !== 0) return
        onEndGame()
    }, [count, onEndGame])

    useEffect(() => {
        startCountdown()
    }, [startCountdown])

    return (
        <div className="flex-col min-h-screen">
            <ModalPageHeader before={<PanelHeaderBack onClick={onStopGame} />} children={"Игра"} />

            <Div className="flex-row justify-between items-center flex-1">
                <div className="w-[60px] h-[80px] flex items-center justify-center shadow-card bg-vk-secondary rounded-xl">
                    <Title level="2" weight="2">
                        {currentCardIndex + 1}/{data.cards.length}
                    </Title>
                </div>

                <div className="relative w-[160px] h-[160px]">
                    <svg
                        className={cn(
                            "absolute inset-0 rounded-full -rotate-90 text-accent transition-colors",
                            count <= 50 && "text-dynamic-red",
                        )}
                        width="160"
                        height="160"
                        viewBox="0 0 160 160"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="80"
                            cy="80"
                            r="80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="16"
                            strokeDasharray="502,6548245744"
                            strokeDashoffset={strokeOffset}
                        ></circle>
                    </svg>
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-vk-secondary size-[144px] rounded-full flex-col gap-2.5 items-center justify-center">
                        <span className="text-[40px] leading-none font-semibold">
                            {Math.floor(count / 10)}
                        </span>
                        <span className="text-[20px] leading-none font-semibold">сек</span>
                    </div>
                </div>

                <div className="w-[60px] h-[80px] flex-row gap-[3px] items-center justify-center shadow-card bg-vk-secondary rounded-xl">
                    <Title level="2" weight="2">
                        {correctAnswers.count}
                    </Title>
                    <Icon32CheckbitOutline width={18} height={18} className="text-accent" />
                </div>
            </Div>

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
