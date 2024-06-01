import { Icon16Like, Icon24ChevronDown } from "@vkontakte/icons"
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import { Button, Div, Group, Header } from "@vkontakte/vkui"
import { HTMLMotionProps, motion } from "framer-motion"
import { DateTime } from "luxon"
import { useState } from "react"
import { GameModeCard } from "../entities/game/ui/game-mode-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { plural } from "../shared/helpers/plural"
import { useModalState } from "../shared/hooks/useModalState"
import { Skeleton } from "../shared/ui/skeleton"
import { Categories } from "./categories"
import { FiveLetters } from "./five-letters"
import { GetAdditionalAttempt } from "./get-additional-attempt"
import { Leaderboard } from "./leaderboard"
import { PlayDefaultGame } from "./play-default-game"
import { PlayRankedGame } from "./play-ranked-game"

const AnimatedImage = (props: { src: string } & HTMLMotionProps<"img">) => {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <motion.img
            {...props}
            onLoad={() => setImageLoaded(true)}
            initial={props.initial}
            animate={imageLoaded ? props.animate : undefined}
            transition={{ duration: 0.6, type: "spring", bounce: 0, ...props.transition }}
            className={props.className}
            src={props.src}
        />
    )
}

export const SelectGame = ({ openFiveLetters }: { openFiveLetters?: boolean }) => {
    const utils = trpc.useUtils()

    const playOfficialStacksModal = useModalState()
    const playDefaultGameModal = useModalState()
    const playRatingGameModal = useModalState()
    const playFiveLettersGameModal = useModalState(openFiveLetters ?? false)
    const leaderboardModal = useModalState()

    const { data: currentSeason } = trpc.rating.getCurrentSeason.useQuery()

    const { data: ratingAttemptsLeft, refetch } = trpc.game.getRatingAttemptsLeftToday.useQuery()

    const { data: fiveLetters } = trpc.fiveLetters.getTodayAttempts.useQuery()

    const { data: hasAdditionalAttempt } = trpc.game.hasAdditionalAttempt.useQuery()

    const { mutate: getAdditionalAttempt } = trpc.game.getAdditionalAttempt.useMutation({
        onSuccess: () => {
            refetch()
            utils.game.hasAdditionalAttempt.setData(undefined, true)
        },
    })

    const ratingDaysLeft = DateTime.fromISO(currentSeason?.season?.endsAt ?? "")
        .diffNow()
        .rescale()
        .set({ millisecond: 0, second: 0 })
        .rescale()
        .toHuman({ maximumFractionDigits: 0 })
        .replace(/\s/g, " ")

    return (
        <>
            <Group>
                <Div
                    className={
                        "max-w-[390px] md:grid-cols-6 md:max-w-[960px] mx-auto grid grid-cols-3 gap-x-3 pt-0"
                    }
                >
                    <GameModeCard
                        title={"Изучение"}
                        cover={
                            <div className={"relative rounded-xl overflow-hidden"}>
                                <div
                                    className={"bg-[#AD4DEE] rounded-xl aspect-[21.8/19.2] mt-6"}
                                />
                                <AnimatedImage
                                    src={"/game-objects/books.webp"}
                                    className={"absolute w-full bottom-0"}
                                    initial={{ translateY: "100%", opacity: 0 }}
                                    animate={{ translateY: 0, opacity: 1 }}
                                />
                            </div>
                        }
                        onClick={playOfficialStacksModal.open}
                    />
                    <GameModeCard
                        className={"col-span-2"}
                        title={"Рейтинговая игра"}
                        caption={
                            ratingAttemptsLeft === 0 && !hasAdditionalAttempt ? (
                                <span className={"flex gap-1 items-center"}>
                                    1
                                    <Icon16Like className={"text-dynamic-yellow"} />
                                </span>
                            ) : (
                                <span className={"flex gap-1 items-center"}>
                                    {ratingAttemptsLeft ?? (
                                        <Skeleton className={"w-[1ch] bg-secondary"} />
                                    )}
                                    <Icon16Like className={"text-learning-red"} />
                                </span>
                            )
                        }
                        cover={
                            <div className={"relative rounded-xl overflow-hidden h-full w-full"}>
                                <div
                                    className={
                                        "bg-learning-red rounded-xl h-full w-full relative mt-6"
                                    }
                                />
                                <AnimatedImage
                                    src={"/game-objects/cup.webp"}
                                    className={"absolute w-1/2 bottom-0 right-[3%]"}
                                    initial={{ translateX: "100%", opacity: 0 }}
                                    animate={{ translateX: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                />
                                <AnimatedImage
                                    src={"/game-objects/pedestal.webp"}
                                    className={"absolute w-[60%] -bottom-1 left-[3%]"}
                                    initial={{ translateX: "-100%", opacity: 0 }}
                                    animate={{ translateX: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                />
                            </div>
                        }
                        onClick={playRatingGameModal.open}
                    />
                    <GameModeCard
                        className={"col-span-2"}
                        title={"Пять букв"}
                        caption={
                            fiveLetters?.status === "resolved"
                                ? "Вы угадали"
                                : `${plural(6 - (fiveLetters?.attempts?.length ?? 0), [
                                      "попытка",
                                      "попытки",
                                      "попыток",
                                  ])}`
                        }
                        cover={
                            <div className={"relative rounded-xl overflow-hidden h-full w-full"}>
                                <div
                                    className={
                                        "bg-[#0077FF] rounded-xl h-full w-full relative mt-6"
                                    }
                                />
                                <AnimatedImage
                                    src={"/game-objects/five-letters-cubes.webp"}
                                    className={"absolute w-full bottom-0"}
                                    initial={{ translateY: "100%", opacity: 0 }}
                                    animate={{ translateY: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                />
                            </div>
                        }
                        onClick={playFiveLettersGameModal.open}
                    />
                    <GameModeCard
                        title={"Обычная игра"}
                        cover={
                            <div className={"relative rounded-xl overflow-hidden h-full w-full"}>
                                <div
                                    className={
                                        "bg-[#17D686] rounded-xl aspect-[21.8/19.2] relative mt-6"
                                    }
                                />
                                <AnimatedImage
                                    src={"/game-objects/cards.webp"}
                                    className={"absolute w-full bottom-0"}
                                    initial={{ translateY: "100%", opacity: 0 }}
                                    animate={{ translateY: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                />
                            </div>
                        }
                        onClick={playDefaultGameModal.open}
                    />
                </Div>
            </Group>

            <Group>
                <Header
                    children={"Лидеры в рейтинге"}
                    subtitle={`${ratingDaysLeft} до конца сезона`}
                />
                <Leaderboard minimized={true} defaultTab={"global"} />
                <Div>
                    <Button
                        stretched
                        size={"l"}
                        mode={"secondary"}
                        before={<Icon24ChevronDown />}
                        children={"Показать больше"}
                        onClick={leaderboardModal.open}
                    />
                </Div>
            </Group>

            <div className={"h-tabbar-height"} />

            <ModalWindow {...playOfficialStacksModal} fullscreen title={"Изучение"}>
                <Categories />
            </ModalWindow>

            <ModalWindow {...playDefaultGameModal} fullscreen title={"Выберите коллекцию"}>
                <PlayDefaultGame />
            </ModalWindow>

            <ModalWrapper {...playRatingGameModal}>
                {ratingAttemptsLeft === 0 ? (
                    <GetAdditionalAttempt
                        isExtraEffort={!!hasAdditionalAttempt}
                        onClose={playRatingGameModal.close}
                        onAction={() => {
                            bridge
                                .send("VKWebAppShowNativeAds", {
                                    ad_format: EAdsFormats.REWARD,
                                })
                                .then(() => {
                                    getAdditionalAttempt()
                                })
                        }}
                    />
                ) : (
                    <ModalBody>
                        <PlayRankedGame onClose={playRatingGameModal.close} />
                    </ModalBody>
                )}
            </ModalWrapper>

            <ModalWindow {...playFiveLettersGameModal} fullscreen>
                <FiveLetters onClose={playFiveLettersGameModal.close} />
            </ModalWindow>

            <ModalWindow {...leaderboardModal} fullscreen disableDragToClose>
                <Leaderboard onClose={leaderboardModal.close} />
            </ModalWindow>
        </>
    )
}
