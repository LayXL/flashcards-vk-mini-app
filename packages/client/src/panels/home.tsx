import { Icon28CheckCircleOn, Icon28Like, Icon28LikeFillRed } from "@vkontakte/icons"
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import {
    Button,
    Caption,
    Div,
    Group,
    Header,
    Headline,
    PanelHeader,
    Separator,
    Spacing,
    Subhead,
    Title,
} from "@vkontakte/vkui"
import { useWindowSize } from "usehooks-ts"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { plural } from "../shared/helpers/plural"
import { useModalState } from "../shared/hooks/useModalState"
import { DailyStreak } from "../widgets/daily-streak"
import { FiveLetters } from "../widgets/five-letters"
import { GetAdditionalAttempt } from "../widgets/get-additional-attempt"
import { PlayRankedGame } from "../widgets/play-ranked-game"
import { Stats } from "../widgets/stats"
import { StoriesFeed } from "../widgets/stories-feed"

export const Home = () => {
    const { data: fiveLettersProgress } = trpc.fiveLetters.getTodayAttempts.useQuery()
    const { data: ratingAttemptsLeft } = trpc.game.getRatingAttemptsLeftToday.useQuery()
    const { data: user } = trpc.getUser.useQuery()

    const latestAttempt = fiveLettersProgress?.attempts[fiveLettersProgress.attempts.length - 1]

    const fiveLettersModal = useModalState()
    const playRatingModal = useModalState()

    const windowSize = useWindowSize()

    const utils = trpc.useUtils()

    const { data: hasAdditionalAttempt } = trpc.game.hasAdditionalAttempt.useQuery()

    const { mutate: getAdditionalAttempt } = trpc.game.getAdditionalAttempt.useMutation({
        onSuccess: () => {
            utils.game.hasAdditionalAttempt.setData(undefined, true)
        },
    })

    const stats = (
        <Group>
            <Header children={"Статистика"} />

            <Div>
                <Stats />
            </Div>
        </Group>
    )

    const daily = (
        <Group>
            <Header children={"Ежедневные задания"} />

            <Div>
                <div
                    className={
                        "flex flex-col gap-4 p-4 bg-secondary rounded-xl select-none cursor-pointer"
                    }
                    onClick={fiveLettersModal.open}
                >
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col gap-2"}>
                            <Title
                                level={"2"}
                                weight={"3"}
                                className={"text-muted !font-bold"}
                                children={"Отгадай слово из 5 букв"}
                            />

                            <Caption
                                level={"2"}
                                className={"text-subhead text-balance"}
                                children={
                                    "Примените свой словарный запас и логическое мышление, чтобы отгадать слово в мини-игре и расширить свой словарь"
                                }
                            />
                        </div>

                        <div className={"flex justify-between items-center"}>
                            <div className={"flex gap-1.5"}>
                                {(latestAttempt ?? Array.from({ length: 5 })).map((letter, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-6 aspect-square rounded-[4px] bg-vk-modal",
                                            letter?.type === "correct" && "bg-dynamic-green",
                                            letter?.type === "excluded" &&
                                                "bg-gray-300 dark:bg-gray-500",
                                            letter?.type === "misplaced" &&
                                                "bg-yellow-400 dark:bg-yellow-500"
                                        )}
                                    />
                                ))}
                            </div>

                            <Subhead weight={"2"} className={"text-muted"}>
                                {fiveLettersProgress?.status === "resolved" ? (
                                    <span className={"text-dynamic-green"}>
                                        за&nbsp;
                                        {plural(fiveLettersProgress.attempts.length ?? 0, [
                                            "попытку",
                                            "попытки",
                                            "попыток",
                                        ])}
                                    </span>
                                ) : (
                                    <>
                                        <span>
                                            {fiveLettersProgress?.correctLetters.length ?? 0}
                                        </span>
                                        <span className={"text-secondary"}>/5</span>
                                    </>
                                )}
                            </Subhead>
                        </div>

                        <div>
                            <Separator wide />

                            <div className={"flex justify-between items-center pt-3"}>
                                <Subhead
                                    children={"Награда за выполнение"}
                                    className={"max-w-32 text-secondary"}
                                />
                                <div className={"flex gap-3 items-center"}>
                                    <Headline children={"5 XP"} className={"text-accent"} />
                                    {fiveLettersProgress?.status === "resolved" && (
                                        <Icon28CheckCircleOn className={"text-dynamic-green"} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button children={"Играть"} size={"l"} onClick={fiveLettersModal.open} />
                </div>
            </Div>
            <Div>
                <div
                    className={
                        "flex flex-col gap-4 p-4 bg-secondary rounded-xl select-none cursor-pointer"
                    }
                    onClick={playRatingModal.open}
                >
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col gap-2"}>
                            <Title
                                level={"2"}
                                weight={"3"}
                                className={"text-muted !font-bold"}
                                children={"Попробуй себя в рейтинге"}
                            />

                            <Caption
                                level={"2"}
                                className={"text-subhead text-balance"}
                                children={
                                    "Покажите всем, что вы знаток английского языка. Соревнуйтесь с другими пользователями, набирайте очки и становитесь лидером в изучении новых слов"
                                }
                            />
                        </div>

                        <div className={"flex justify-between items-center"}>
                            <div className={"flex gap-1.5"}>
                                {Array.from({ length: ratingAttemptsLeft ?? 0 }).map((_, i) =>
                                    i === 0 && hasAdditionalAttempt ? (
                                        <Icon28Like key={i} className={"text-amber-400"} />
                                    ) : (
                                        <Icon28LikeFillRed key={i} />
                                    )
                                )}
                                {Array.from({
                                    length:
                                        (hasAdditionalAttempt ? 4 : 3) - (ratingAttemptsLeft ?? 0),
                                }).map((_, i) => (
                                    <Icon28Like key={i} className={"text-secondary"} />
                                ))}
                            </div>

                            <Subhead weight={"2"} className={"text-muted"}>
                                {ratingAttemptsLeft === 0 ? (
                                    <span className={"text-dynamic-green"}>
                                        +
                                        {plural(user?.stats.todayStats?.points ?? 0, [
                                            "балл",
                                            "балла",
                                            "баллов",
                                        ])}
                                    </span>
                                ) : (
                                    <>
                                        <span>{ratingAttemptsLeft}</span>
                                        <span className={"text-secondary"}>
                                            /{hasAdditionalAttempt ? 4 : 3}
                                        </span>
                                    </>
                                )}
                            </Subhead>
                        </div>
                    </div>

                    <Button
                        children={
                            !hasAdditionalAttempt && ratingAttemptsLeft === 0
                                ? "Получить доп. попытку"
                                : "Начать"
                        }
                        size={"l"}
                        onClick={playRatingModal.open}
                    />
                </div>
            </Div>
        </Group>
    )

    return (
        <>
            <PanelHeader children={"Лёрнинг"} />
            <SearchBar />
            <StoriesFeed />
            <Group>
                <Header children={"Ударный режим"} />
                <DailyStreak />
            </Group>
            {windowSize.width <= 768 ? (
                <>
                    {stats}
                    {daily}
                </>
            ) : (
                <div className={"grid md:grid-cols-2 gap-x-4"}>
                    <div children={stats} />
                    <div children={daily} />
                </div>
            )}
            <Spacing size={128} />
            <ModalWrapper isOpened={fiveLettersModal.isOpened} onClose={fiveLettersModal.close}>
                <ModalBody fullscreen>
                    <FiveLetters onClose={fiveLettersModal.close} />
                </ModalBody>
            </ModalWrapper>
            <ModalWrapper isOpened={playRatingModal.isOpened} onClose={playRatingModal.close}>
                {ratingAttemptsLeft === 0 ? (
                    <GetAdditionalAttempt
                        isExtraEffort={!!hasAdditionalAttempt}
                        onClose={playRatingModal.close}
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
                        <PlayRankedGame onClose={playRatingModal.close} />
                    </ModalBody>
                )}
            </ModalWrapper>
            <TabBar />
        </>
    )
}
