import { keepPreviousData } from "@tanstack/react-query"
import {
    Icon24CheckCircleOutline,
    Icon24GearOutline,
    Icon24UserCircleOutline,
} from "@vkontakte/icons"
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import { Div, Search, SubnavigationBar, SubnavigationButton } from "@vkontakte/vkui"
import { useCallback, useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { StackCell } from "../entities/stack/ui/stack-cell"
import { useModal } from "../features/modal/contexts/modal-context"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { RouterInput, trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "./game-results"
import { GameSettings } from "./game-settings"
import { InGame } from "./in-game"

export const PlayDefaultGame = () => {
    const modal = useModal()

    const gameSettingsModal = useModalState()
    const gameModal = useModalState()
    const gameResultsModal = useModalState(false, { onClose: modal?.onClose })

    const [gameSettings, setGameSettings] = useState<{
        selectedModifiers: ("time" | "attempts" | "repeat")[]
        gameDuration: number | null
        correctAnswerAddDuration: number | null
        attemptCount: number | null
    }>({
        selectedModifiers: ["time"],
        gameDuration: 60,
        correctAnswerAddDuration: 1,
        attemptCount: 3,
    })

    const [searchValue, setSearchValue] = useState("")
    const [debouncedSearchValue] = useDebounceValue(searchValue, 300)

    const [filter, setFilter] =
        useState<RouterInput["game"]["getAvailableStacksForGame"]["filter"]>("default")

    const { data: stacks } = trpc.game.getAvailableStacksForGame.useQuery(
        {
            filter,
            search: debouncedSearchValue.length > 0 ? debouncedSearchValue : undefined,
        },
        {
            placeholderData: keepPreviousData,
        }
    )

    const utils = trpc.useUtils()

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

    const startWithStack = useCallback(
        (id: number) => () => {
            start({
                type: "default",
                stackIds: [id],
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
        },
        [gameSettings, start]
    )

    const stopGame = useCallback(() => {
        gameModal.close()
        resetGameData()
    }, [gameModal, resetGameData])

    const endGame = useCallback(() => {
        gameModal.close()
        gameResultsModal.open()
    }, [gameModal, gameResultsModal])

    useEffect(() => {
        bridge.send("VKWebAppCheckNativeAds", { ad_format: EAdsFormats.INTERSTITIAL })
    })

    return (
        <>
            <div>
                <Search
                    placeholder={"Поиск коллекций"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <SubnavigationBar>
                <SubnavigationButton
                    mode={"outline"}
                    before={<Icon24GearOutline className={"text-secondary"} />}
                    children={"Настройки"}
                    onClick={gameSettingsModal.open}
                />
                <SubnavigationButton
                    selected={filter === "verified"}
                    mode={"primary"}
                    before={<Icon24CheckCircleOutline className={"text-learning-red"} />}
                    children={"Официальные"}
                    onClick={() =>
                        filter === "verified" ? setFilter("default") : setFilter("verified")
                    }
                />
                <SubnavigationButton
                    selected={filter === "created"}
                    mode={"primary"}
                    before={<Icon24UserCircleOutline />}
                    children={"Созданные мной"}
                    onClick={() =>
                        filter === "created" ? setFilter("default") : setFilter("created")
                    }
                />
            </SubnavigationBar>
            <Div className={"flex flex-col gap-3"}>
                {stacks?.map((stack) => (
                    <StackCell
                        key={stack.id}
                        title={stack.name}
                        translationsCount={stack.translationsCount}
                        authorName={stack.author.firstName}
                        isVerified={stack.isVerified}
                        onClick={startWithStack(stack.id)}
                        onPlay={startWithStack(stack.id)}
                        encodedBackground={stack.encodedBackground}
                    />
                ))}
            </Div>

            <div className={"h-safe-area-bottom"} />

            <ModalWindow {...gameSettingsModal} title={"Настройки"}>
                <GameSettings
                    onClose={gameSettingsModal.close}
                    gameSettings={gameSettings}
                    onChangeGameSettings={setGameSettings}
                />
            </ModalWindow>

            <ModalWindow
                isOpened={gameModal.isOpened && !!data}
                onClose={stopGame}
                disableDragToClose
                fullscreen
            >
                {data && <InGame onEndGame={endGame} onStopGame={stopGame} data={data} />}
            </ModalWindow>

            <ModalWindow
                isOpened={gameResultsModal.isOpened}
                onClose={gameResultsModal.close}
                disableDragToClose
                fullscreen
            >
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
            </ModalWindow>
        </>
    )
}
