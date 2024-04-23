import { Icon28Like, Icon28LikeFillRed } from "@vkontakte/icons"
import { Button, Div, ModalPageHeader, PanelHeaderBack, Title } from "@vkontakte/vkui"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { useBoolean, useCounter } from "usehooks-ts"
import { RouterOutput, trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { vibrateOnError, vibrateOnSuccess } from "../shared/helpers/vibrate"
import { vkTheme } from "../shared/helpers/vkTheme"
import { Timer } from "../shared/ui/timer"

type InGameProps = {
    onStopGame: () => void
    onEndGame: () => void
    data: RouterOutput["game"]["start"]
}

export const InGame = ({ onStopGame, onEndGame, data }: InGameProps) => {
    const controls = useAnimationControls()

    const [cards, setCards] = useState<{ order: number; title: string; choices: string[] }[]>(
        data.cards
    )

    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const currentCardData = useMemo(() => cards[currentCardIndex], [cards, currentCardIndex])
    const nextCardData = useMemo(
        () => cards[currentCardIndex + 1] ?? null,
        [cards, currentCardIndex]
    )

    const correctAnswers = useCounter(0)
    const attempts = useCounter(data.gameSession.attemptsCount ?? 0)

    const withTimer = data.gameSession.gameDuration && data.gameSession.gameDuration > 0
    const withAttempts = (data.gameSession.attemptsCount ?? -1) >= 0
    const withRepeat = !!data.gameSession.repeatCards

    const [endsAt, setEndsAt] = useState<Date>(
        DateTime.now()
            .plus({ seconds: data.gameSession.gameDuration ?? 0 })
            .toJSDate()
    )

    const memoizedTimer = useMemo(
        () => <Timer max={60} endsAt={endsAt} onEnd={() => onEndGame()} controls={controls} />,
        [endsAt, controls, onEndGame]
    )

    const memoizedAttempts = useMemo(
        () =>
            withAttempts && (
                <div className={"min-w-10 p-3 bg-vk-secondary rounded-xl flex justify-center"}>
                    {Array.from({ length: attempts.count ?? 0 }).map((_, i) => (
                        <Icon28LikeFillRed key={i} />
                    ))}
                    {Array.from({
                        length: (data.gameSession.attemptsCount ?? 0) - (attempts.count ?? 0),
                    }).map((_, i) => (
                        <Icon28Like key={i} className={"text-secondary"} />
                    ))}
                </div>
            ),
        [attempts.count, data.gameSession.attemptsCount, withAttempts]
    )

    const { mutate: answer } = trpc.game.answer.useMutation({
        onMutate: () => {
            return {
                cardData: currentCardData,
            }
        },
        onSuccess: ({ status }, _, { cardData }) => {
            controls.start(status).then(() => controls.start("initial"))

            if (status === "correct") {
                correctAnswers.increment()

                vibrateOnSuccess()

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
                vibrateOnError()

                if (withAttempts) {
                    attempts.decrement()
                    if (attempts.count - 1 <= 0) return onEndGame()
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

    const cardsLeft = cards.length - currentCardIndex - 1

    return (
        <div className={"flex-col h-full"}>
            <ModalPageHeader before={<PanelHeaderBack onClick={onStopGame} />} children={"Игра"} />

            {withTimer && (
                <Div className={"flex-row justify-between items-center flex-1 select-none"}>
                    <div className={"flex-1 flex justify-start"}>
                        {data.gameSession.type !== "ranked" && (
                            <div
                                className={
                                    "min-w-10 p-3 bg-vk-secondary rounded-xl flex justify-center items-center"
                                }
                            >
                                <span>
                                    {data.gameSession.repeatCards
                                        ? correctAnswers.count
                                        : currentCardIndex + 1}
                                    /{data.cards.length}
                                </span>
                            </div>
                        )}
                    </div>

                    {memoizedTimer}

                    <div className={"flex-1 justify-end flex"} children={memoizedAttempts} />
                </Div>
            )}

            {!withTimer && (
                <Div className={"flex-1 select-none"}>
                    <div className={"flex justify-center gap-2"}>
                        <motion.div
                            animate={controls}
                            variants={{
                                initial: {
                                    backgroundColor: `var(${vkTheme.colorBackgroundSecondary.normal.name})`,
                                    transition: {
                                        duration: 0.2,
                                        delay: 0.6,
                                    },
                                },
                                correct: {
                                    backgroundColor: `var(${vkTheme.colorAccentGreen.normal.name})`,
                                    transition: {
                                        duration: 0.2,
                                    },
                                },
                                incorrect: {
                                    backgroundColor: `var(${vkTheme.colorAccentRed.normal.name})`,
                                    transition: {
                                        duration: 0.2,
                                    },
                                },
                            }}
                            className={
                                "min-w-10 p-3 bg-vk-secondary rounded-xl flex justify-center items-center"
                            }
                        >
                            <span>
                                {data.gameSession.repeatCards
                                    ? correctAnswers.count
                                    : currentCardIndex + 1}
                                /{data.cards.length}
                            </span>
                        </motion.div>
                        {memoizedAttempts}
                    </div>
                </Div>
            )}

            <Div>
                <div className={"flex-col box-border"}>
                    <div className={"h-[20px] overflow-hidden relative"}>
                        <div
                            className={cn(
                                "absolute left-[24px] right-[24px]",
                                "rounded-2xl aspect-square bg-vk-secondary dark:brightness-[120%]",
                                cardsLeft <= 1 && "invisible"
                            )}
                        />
                        <div
                            className={cn(
                                "absolute left-[12px] right-[12px] top-[8px]",
                                "rounded-2xl aspect-square bg-vk-secondary dark:brightness-[110%]",
                                cardsLeft === 0 && "invisible"
                            )}
                        />
                    </div>
                    <div className={"relative select-none overflow-visible"}>
                        <div className={"z-10 overflow-visible"}>
                            {currentCardData && (
                                <Card
                                    title={currentCardData.title}
                                    choices={currentCardData.choices}
                                    onClick={(i) => {
                                        answer({
                                            order: currentCardData.order ?? 0,
                                            answer: currentCardData.choices[i] ?? "",
                                        })
                                    }}
                                    onNext={() => {
                                        setCurrentCardIndex((prev) => prev + 1)
                                        if (currentCardIndex + 1 === cards.length) onEndGame()
                                    }}
                                    key={currentCardData.order}
                                />
                            )}
                        </div>

                        {nextCardData && (
                            <div
                                className={
                                    "absolute inset-0 pointer-events-none -z-10 overflow-visible pb-safe-area-bottom"
                                }
                                style={{ filter: "brightness(1.1)" }}
                            >
                                <Card
                                    isNextCard={true}
                                    title={nextCardData?.title}
                                    choices={nextCardData?.choices}
                                    key={nextCardData?.order}
                                    onClick={undefined}
                                    onNext={undefined}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Div>
        </div>
    )
}

const Card = ({
    title,
    choices,
    onClick,
    onNext,
    isNextCard = false,
}: {
    isNextCard?: boolean
    title: string
    choices: string[]
    onClick?: (x: number) => void
    onNext?: () => void
}) => {
    const { value: isShown, setFalse: hide } = useBoolean(true)

    return (
        <AnimatePresence>
            {isShown && (
                <motion.div
                    initial={{
                        filter: "brightness(1.1)",
                        translateY: -10,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                    animate={
                        isNextCard
                            ? {}
                            : {
                                  filter: "brightness(1)",
                                  translateY: 0,
                                  marginLeft: 0,
                                  marginRight: 0,
                              }
                    }
                    exit={{ translateY: "100%", opacity: 0 }}
                    transition={{
                        duration: 0.15,
                        bounce: 0,
                    }}
                    onAnimationComplete={(definition) => {
                        // @ts-expect-error opacity exists
                        if (definition?.opacity !== undefined) onNext?.()
                    }}
                    className={"p-3 bg-vk-secondary rounded-2xl"}
                >
                    <div
                        className={
                            "w-full h-60 flex-col gap-3 items-center justify-center text-center"
                        }
                    >
                        <Title children={title} />
                    </div>

                    <div className={"flex-col gap-3"}>
                        {choices.map((choice, i) => (
                            <Button
                                key={i}
                                stretched={true}
                                size={"l"}
                                children={choice}
                                onClick={() => {
                                    hide()
                                    onClick?.(i)
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
