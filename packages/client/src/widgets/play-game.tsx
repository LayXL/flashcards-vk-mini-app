import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import {
    Button,
    Cell,
    Div,
    Group,
    Header,
    ModalPageHeader,
    PanelHeaderBack,
    Select,
    SimpleCell,
} from "@vkontakte/vkui"
import { useCallback, useEffect, useState } from "react"
import AtemptsModifierIcon from "../assets/modifier-icons/attempts.svg?react"
import RepeatModifierIcon from "../assets/modifier-icons/repeat.svg?react"
import TimeModifierIcon from "../assets/modifier-icons/time.svg?react"
import { ModifierCard } from "../entities/game/ui/modifier-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "./game-results"
import { InGame } from "./in-game"
import { StackSelect } from "./stack-select"

const attempts = Array.from({ length: 5 }).map((_, i) => ({
    label: i === 0 ? "Ни шанса на ошибку ☠️" : (i + 1).toString(),
    value: (i + 1).toString(),
}))

const gameDurations = Array.from({ length: 60 / 5 }).map((_, i) => ({
    label: `${(i + 1) * 5} сек`,
    value: ((i + 1) * 5).toString(),
}))

const correctAnswerAddDurations = Array.from({ length: 11 }).map((_, i) => ({
    label: `${i} сек`,
    value: i.toString(),
}))

type PlayGameProps = {
    stackId?: number
    onClose?: () => void
}

export const PlayGame = ({ stackId, onClose }: PlayGameProps) => {
    const gameModal = useModalState()
    const gameResultsModal = useModalState(false, { onClose })
    const gameStackSelectModal = useModalState()

    const utils = trpc.useUtils()

    const [gameSettings, setGameSettings] = useState<{
        stacks: number[]
        selectedModifiers: ("time" | "attempts" | "repeat")[]
        gameDuration: number | null
        correctAnswerAddDuration: number | null
        attemptCount: number | null
    }>({
        stacks: stackId ? [stackId] : [],
        selectedModifiers: [],
        gameDuration: 30,
        correctAnswerAddDuration: 1,
        attemptCount: 3,
    })

    const { data: stacksData } = trpc.stacks.getSingle.useQuery(
        {
            id: gameSettings.stacks[0],
        },
        {
            enabled: gameSettings.stacks.length > 0,
        }
    )

    const {
        mutate: start,
        reset: resetGameData,
        data,
    } = trpc.game.start.useMutation({
        onSuccess: () => {
            gameModal.open()
            utils.game.getRecentlyStacks.invalidate()
            utils.game.getRecentlyGames.invalidate()
        },
    })

    const startGame = useCallback(() => {
        if (!gameSettings.stacks) return

        start({
            type: "default",
            stackIds: gameSettings.stacks,
            attemptsCount: gameSettings.selectedModifiers.includes("attempts")
                ? gameSettings.attemptCount
                : undefined,
            gameDuration: gameSettings.selectedModifiers.includes("time")
                ? gameSettings.gameDuration
                : undefined,
            correctAnswerAddDuration: gameSettings.selectedModifiers.includes("time")
                ? gameSettings.correctAnswerAddDuration
                : undefined,
            repeatCards: gameSettings.selectedModifiers.includes("repeat"),
        })
    }, [gameSettings, start])

    const onClickModifier = useCallback(
        (modifier: "time" | "attempts" | "repeat") => {
            return () => {
                setGameSettings((prev) => ({
                    ...prev,
                    selectedModifiers: prev.selectedModifiers.includes(modifier)
                        ? prev.selectedModifiers.filter((m) => m !== modifier)
                        : ([...prev.selectedModifiers, modifier] as const),
                }))
            }
        },
        [setGameSettings]
    )

    const stopGame = useCallback(() => {
        utils.game.getRatingAttemptsLeftToday.invalidate()
        gameModal.close()
        resetGameData()
    }, [gameModal, resetGameData, utils.game.getRatingAttemptsLeftToday])

    const endGame = useCallback(() => {
        utils.game.getRatingAttemptsLeftToday.invalidate()
        gameModal.close()
        gameResultsModal.open()
    }, [gameModal, gameResultsModal, utils.game.getRatingAttemptsLeftToday])

    useEffect(() => {
        bridge.send("VKWebAppCheckNativeAds", { ad_format: EAdsFormats.INTERSTITIAL })
    })

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Настройки"}
            />

            <Group>
                <Header
                    mode={"secondary"}
                    children={"Коллекция для игры"}
                    subtitle={"Возьмём оттуда карточки переводов для игры"}
                />
                <SimpleCell
                    children={"Выбрать коллекцию"}
                    onClick={gameStackSelectModal.open}
                    expandable={"always"}
                    indicator={stacksData?.name}
                />
            </Group>

            <Group>
                <Header
                    mode={"secondary"}
                    children={"Модификаторы"}
                    subtitle={"Применяй модификаторы для усложнения игры"}
                />

                <Div className={"flex gap-3"}>
                    <ModifierCard
                        name={"Время"}
                        icon={<TimeModifierIcon />}
                        onClick={onClickModifier("time")}
                        isSelected={gameSettings.selectedModifiers.includes("time")}
                    />
                    <ModifierCard
                        name={"Попытки"}
                        icon={<AtemptsModifierIcon />}
                        onClick={onClickModifier("attempts")}
                        isSelected={gameSettings.selectedModifiers.includes("attempts")}
                    />
                    <ModifierCard
                        name={"Повторение"}
                        icon={<RepeatModifierIcon />}
                        onClick={onClickModifier("repeat")}
                        isSelected={gameSettings.selectedModifiers.includes("repeat")}
                    />
                </Div>
            </Group>

            {(gameSettings.selectedModifiers.includes("time") ||
                gameSettings.selectedModifiers.includes("attempts")) && (
                <Group className={"animate-fade-in"}>
                    <Header mode={"secondary"} children={"Настройки"} />
                    {gameSettings.selectedModifiers.includes("time") && (
                        <>
                            <Cell
                                className={"animate-fade-in"}
                                children={"Длительность игры"}
                                after={
                                    <div className={"w-[128px]"}>
                                        <Select
                                            value={gameSettings.gameDuration?.toString() ?? "60"}
                                            options={gameDurations}
                                            onChange={({ currentTarget: { value } }) => {
                                                setGameSettings((prev) => ({
                                                    ...prev,
                                                    gameDuration: parseInt(value),
                                                }))
                                            }}
                                        />
                                    </div>
                                }
                            />
                            <Cell
                                className={"animate-fade-in"}
                                children={"Правильный ответ добавит"}
                                after={
                                    <div className={"w-[128px]"}>
                                        <Select
                                            value={
                                                gameSettings.correctAnswerAddDuration?.toString() ??
                                                "1"
                                            }
                                            options={correctAnswerAddDurations}
                                            onChange={({ currentTarget: { value } }) => {
                                                setGameSettings((prev) => ({
                                                    ...prev,
                                                    correctAnswerAddDuration: parseInt(value),
                                                }))
                                            }}
                                        />
                                    </div>
                                }
                            />
                        </>
                    )}

                    {gameSettings.selectedModifiers.includes("attempts") && (
                        <Cell
                            className={"animate-fade-in"}
                            children={"Количество попыток"}
                            after={
                                <div className={"w-[128px]"}>
                                    <Select
                                        value={gameSettings.attemptCount?.toString() ?? "3"}
                                        options={attempts}
                                        onChange={({ currentTarget: { value } }) => {
                                            setGameSettings((prev) => ({
                                                ...prev,
                                                attemptCount: parseInt(value),
                                            }))
                                        }}
                                    />
                                </div>
                            }
                        />
                    )}
                </Group>
            )}

            <Div className={"box-border fixed w-full bottom-0 bg-vk-content"}>
                <Button
                    disabled={gameSettings.stacks.length === 0}
                    children={"Играть"}
                    stretched={true}
                    onClick={startGame}
                    size={"l"}
                />
                {gameSettings.stacks.length === 0 && (
                    <div
                        children={"Сначала выберите коллекцию"}
                        className={"pt-3 text-secondary text-sm select-none"}
                    />
                )}
                <div className={"h-[env(safe-area-inset-bottom)]"} />
            </Div>

            <ModalWrapper
                isOpened={gameStackSelectModal.isOpened}
                onClose={gameStackSelectModal.close}
            >
                <ModalBody fullscreen={true}>
                    <StackSelect
                        canCreateNewStack={false}
                        onClose={gameStackSelectModal.close}
                        onSelect={(id) => {
                            gameStackSelectModal.close()
                            setGameSettings((prev) => ({
                                ...prev,
                                stacks: [id],
                            }))
                        }}
                    />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={gameModal.isOpened} onClose={stopGame}>
                <ModalBody fullscreen={true} disableDragToClose>
                    {data && <InGame onEndGame={endGame} onStopGame={stopGame} data={data} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={gameResultsModal.isOpened} onClose={gameResultsModal.close}>
                <ModalBody fullscreen={true} disableDragToClose>
                    <GameResults
                        id={data?.gameSession.id ?? 0}
                        onClose={() => {
                            gameResultsModal.close()

                            utils.stats.getDailyStreak.invalidate()
                            utils.stats.getActiveDays.invalidate()

                            if (Math.random() <= 0.3) {
                                bridge.send("VKWebAppShowNativeAds", {
                                    ad_format: EAdsFormats.INTERSTITIAL,
                                })
                            }
                        }}
                    />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
