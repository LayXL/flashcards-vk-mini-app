import { Icon24Play, Icon28Cards2Outline } from "@vkontakte/icons"
import {
    Button,
    ButtonGroup,
    Cell,
    Div,
    Group,
    Header,
    ModalPageHeader,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,
    Select,
    SimpleCell,
} from "@vkontakte/vkui"
import { useCallback } from "react"
import { useRecoilState } from "recoil"
import { ModifierCard } from "../entities/game/ui/modifier-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { gameSettingsAtom } from "../shared/store"
import { GameResults } from "../widgets/game-results"
import { InGame } from "../widgets/in-game"
import { StackSelect } from "../widgets/stack-select"

const RecentGameCard = ({ id }: { id: number }) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <div onClick={open} className={"p-3 bg-secondary rounded-xl cursor-pointer"}>
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

const attempts = Array.from({ length: 5 }).map((_, i) => ({
    label: i.toString(),
    value: i.toString(),
}))

const gameDurations = Array.from({ length: 60 / 5 }).map((_, i) => ({
    label: `${(i + 1) * 5} сек`,
    value: ((i + 1) * 5).toString(),
}))

const correctAnswerAddDurations = Array.from({ length: 11 }).map((_, i) => ({
    label: `${i} сек`,
    value: i.toString(),
}))

export const Game = () => {
    const gameModal = useModalState()
    const gameResultsModal = useModalState()
    const gameSettingsModal = useModalState()
    const gameStackSelectModal = useModalState()

    const [gameSettings, setGameSettings] = useRecoilState(gameSettingsAtom)

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
        if (!gameSettings.stacks) return

        start({
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
        [setGameSettings],
    )

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

            <Placeholder
                icon={<Icon28Cards2Outline width={56} height={56} className={"text-accent"} />}
                header={"Закрепляй знания"}
                children={
                    <span className={"text-balance"}>
                        Узнавай новые слова и&nbsp;запоминай старые с&nbsp;помощью игры,
                        где&nbsp;нужно на&nbsp;время выбирать правильный перевод
                    </span>
                }
                action={
                    <ButtonGroup mode={"vertical"} align={"center"}>
                        <Button
                            loading={isPending}
                            before={<Icon24Play />}
                            size={"l"}
                            children={"Начать игру"}
                            onClick={gameSettingsModal.open}
                        />
                    </ButtonGroup>
                }
            />

            <Header>Недавние игры</Header>

            <Div className={"flex-col gap-2"}>
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

            <ModalWrapper isOpened={gameSettingsModal.isOpened} onClose={gameSettingsModal.close}>
                <ModalBody fullscreen>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={gameSettingsModal.close} />}
                        children={"Настройки"}
                    />

                    <Group>
                        <Header mode={"secondary"} children={"Выбрать стопку"} />
                        <SimpleCell
                            children={"Стопка"}
                            onClick={gameStackSelectModal.open}
                            expandable={"always"}
                            indicator={gameSettings.stacks.join(", ").toString()}
                        />
                    </Group>

                    <Group>
                        <Header mode={"secondary"} children={"Модификаторы"} />

                        <Div className={"flex gap-3"}>
                            <ModifierCard
                                name={"Время"}
                                onClick={onClickModifier("time")}
                                isSelected={gameSettings.selectedModifiers.includes("time")}
                            />
                            <ModifierCard
                                name={"Попытки"}
                                onClick={onClickModifier("attempts")}
                                isSelected={gameSettings.selectedModifiers.includes("attempts")}
                            />
                            <ModifierCard
                                name={"Повторение"}
                                onClick={onClickModifier("repeat")}
                                isSelected={gameSettings.selectedModifiers.includes("repeat")}
                            />
                        </Div>
                    </Group>

                    {(gameSettings.selectedModifiers.includes("time") ||
                        gameSettings.selectedModifiers.includes("attempts")) && (
                        <Group>
                            <Header mode={"secondary"} children={"Настройки"} />
                            {gameSettings.selectedModifiers.includes("time") && (
                                <>
                                    <Cell
                                        children={"Длительность игры"}
                                        after={
                                            <div className={"w-[128px]"}>
                                                <Select
                                                    value={
                                                        gameSettings.gameDuration?.toString() ??
                                                        "60"
                                                    }
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
                                                            correctAnswerAddDuration:
                                                                parseInt(value),
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
                                    children={"Количество попыток"}
                                    after={
                                        <div className={"w-[128px]"}>
                                            <Select
                                                value={gameSettings.attemptCount?.toString() ?? "3"}
                                                options={attempts}
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
                            )}
                        </Group>
                    )}

                    <Div className={"box-border fixed w-screen bottom-0 bg-vk-content"}>
                        <Button
                            children={"Играть"}
                            stretched={true}
                            onClick={startGame}
                            size={"l"}
                        />

                        <div className={"h-[env(safe-area-inset-bottom)]"} />
                    </Div>
                </ModalBody>

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
            </ModalWrapper>

            <ModalWrapper isOpened={gameResultsModal.isOpened} onClose={gameResultsModal.close}>
                <ModalBody fullscreen={true}>
                    <GameResults id={data?.gameSession.id ?? 0} onClose={gameResultsModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
