import { Icon24Play, Icon28Cards2 } from "@vkontakte/icons"
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
import { useCallback, useState } from "react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "../widgets/game-results"
import { InGame } from "../widgets/in-game"
import { StackSelect } from "../widgets/stack-select"

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

    // TODO refactor
    const [selectedStack, setSelectedStack] = useState<number | null>(null)
    const [gameDuration, setGameDuration] = useState(60)
    const [correctAnswerAddDuration, setCorrectAnswerAddDuration] = useState(1)

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
        if (!selectedStack) return

        start({
            stackIds: [selectedStack],
            gameDuration,
            correctAnswerAddDuration,
        })
    }, [correctAnswerAddDuration, gameDuration, selectedStack, start])

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
                icon={<Icon28Cards2 width={56} height={56} className="text-accent" />}
                header="Закрепляй знания"
                children="Узнавай новые слова и запоминай старые с помощью игры, где нужно на время выбирать правильный перевод"
                action={
                    <ButtonGroup mode="vertical" align="center">
                        <Button
                            loading={isPending}
                            before={<Icon24Play />}
                            size={"l"}
                            children={"Начать игру"}
                            onClick={startGame}
                        />
                        <Button
                            size="m"
                            mode="tertiary"
                            children="Настроить"
                            onClick={gameSettingsModal.open}
                        />
                    </ButtonGroup>
                }
            />

            <Header>Недавние игры</Header>

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

            <ModalWrapper isOpened={gameSettingsModal.isOpened} onClose={gameSettingsModal.close}>
                <ModalBody>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={gameSettingsModal.close} />}
                        children="Настройки"
                    />

                    <Group>
                        <Header mode="secondary" children="Выбрать стопку" />
                        <SimpleCell
                            children={"Стопка"}
                            onClick={gameStackSelectModal.open}
                            expandable="always"
                            indicator={selectedStack?.toString()}
                        />
                    </Group>

                    <Group>
                        <Header mode="secondary" children="Геймплей" />
                        <Cell
                            children={"Длительность игры"}
                            after={
                                <div className="w-[128px]">
                                    <Select
                                        value={gameDuration.toString()}
                                        options={gameDurations}
                                        onChange={({ currentTarget: { value } }) => {
                                            setGameDuration(parseInt(value))
                                        }}
                                    />
                                </div>
                            }
                        />
                        <Cell
                            children={"Правильный ответ добавляет"}
                            after={
                                <div className="w-[128px]">
                                    <Select
                                        value={correctAnswerAddDuration.toString()}
                                        options={correctAnswerAddDurations}
                                        onChange={({ currentTarget: { value } }) => {
                                            setCorrectAnswerAddDuration(parseInt(value))
                                        }}
                                    />
                                </div>
                            }
                        />
                    </Group>
                    <div className="h-56" />
                </ModalBody>

                <ModalWrapper
                    isOpened={gameStackSelectModal.isOpened}
                    onClose={gameStackSelectModal.close}
                >
                    <ModalBody fullscreen={true}>
                        <StackSelect
                            onClose={gameStackSelectModal.close}
                            onSelect={(id) => {
                                gameStackSelectModal.close()
                                setSelectedStack(id)
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
