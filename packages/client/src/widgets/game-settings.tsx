import { Button, Cell, Div, Group, Header, Select } from "@vkontakte/vkui"
import { useCallback } from "react"
import AtemptsModifierIcon from "../assets/modifier-icons/attempts.svg?react"
import RepeatModifierIcon from "../assets/modifier-icons/repeat.svg?react"
import TimeModifierIcon from "../assets/modifier-icons/time.svg?react"
import { ModifierCard } from "../entities/game/ui/modifier-card"

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

type GameSettingsProps = {
    onClose?: () => void
    gameSettings: {
        selectedModifiers: ("time" | "attempts" | "repeat")[]
        gameDuration: number | null
        correctAnswerAddDuration: number | null
        attemptCount: number | null
    }
    onChangeGameSettings: (gameSettings: GameSettingsProps["gameSettings"]) => void
}

export const GameSettings = ({
    onClose,
    gameSettings,
    onChangeGameSettings,
}: GameSettingsProps) => {
    const onClickModifier = useCallback(
        (modifier: "time" | "attempts" | "repeat") => {
            return () => {
                onChangeGameSettings({
                    ...gameSettings,
                    selectedModifiers: gameSettings.selectedModifiers.includes(modifier)
                        ? gameSettings.selectedModifiers.filter((m) => m !== modifier)
                        : [...gameSettings.selectedModifiers, modifier],
                })
            }
        },
        [gameSettings, onChangeGameSettings]
    )

    return (
        <>
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
                                                onChangeGameSettings({
                                                    ...gameSettings,
                                                    gameDuration: parseInt(value),
                                                })
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
                                                onChangeGameSettings({
                                                    ...gameSettings,
                                                    correctAnswerAddDuration: parseInt(value),
                                                })
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
                                            onChangeGameSettings({
                                                ...gameSettings,
                                                attemptCount: parseInt(value),
                                            })
                                        }}
                                    />
                                </div>
                            }
                        />
                    )}
                </Group>
            )}

            <Div>
                <Button children={"Сохранить"} stretched={true} onClick={onClose} size={"l"} />
            </Div>

            <div className={"h-[env(safe-area-inset-bottom)]"} />
        </>
    )
}
