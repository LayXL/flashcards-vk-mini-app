import { Icon24ChevronRight } from "@vkontakte/icons"
import { Avatar, Caption, Subhead, Text, Title } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { plural } from "../shared/helpers/plural"
import { useModalState } from "../shared/hooks/useModalState"
import { Leaderboard } from "./leaderboard"

export const Stats = () => {
    const { data: userData } = trpc.getUser.useQuery()
    const { data: currentSeason } = trpc.rating.getCurrentSeason.useQuery()

    const leaderboardModal = useModalState()

    return (
        <>
            <div className={"flex gap-3 drop-shadow-card"}>
                <div
                    className={
                        "bg-vk-secondary flex-1 p-3 rounded-xl flex-col justify-between cursor-pointer"
                    }
                    onClick={leaderboardModal.open}
                >
                    <div className={"flex-col"}>
                        <Text children={"Рейтинг в сезоне"} weight={"2"} />
                        {currentSeason?.season?.endsAt && (
                            <Caption
                                children={`осталось ${DateTime.fromISO(
                                    currentSeason?.season?.endsAt
                                )
                                    .diffNow()
                                    .rescale()
                                    .shiftTo("days")
                                    .toHuman({
                                        maximumFractionDigits: 0,
                                    })}`}
                                weight={"3"}
                                level={"2"}
                                className={"text-subhead"}
                            />
                        )}
                    </div>

                    <div className={"flex-col text-accent"}>
                        <Subhead children={"Ваше место"} weight={"1"} />
                        <Title
                            children={currentSeason?.user.place?.toString()}
                            weight={"1"}
                            level={"1"}
                        />
                    </div>

                    <div className={"flex"}>
                        <div className={"flex flex-1 gap-2 items-center"}>
                            <Avatar
                                size={24}
                                src={
                                    userData?.avatarUrls &&
                                    getSuitableAvatarUrl(userData?.avatarUrls, 24)
                                }
                            />
                            <Caption
                                children={plural(currentSeason?.user?.points ?? 0, [
                                    "балл",
                                    "балла",
                                    "баллов",
                                ])}
                            />
                        </div>
                        <Icon24ChevronRight className={"text-secondary -mr-[3px]"} />
                    </div>
                </div>
                <div className={"flex-col gap-3 flex-1"}>
                    <div
                        className={
                            "bg-vk-secondary p-3 rounded-xl h-[76px] box-border cursor-pointer justify-between flex-col"
                        }
                    >
                        <Caption level={"1"} weight={"2"} children={"Слов сегодня"} />
                        <div className={"flex justify-between items-center"}>
                            <Title
                                children={userData?.stats.todayTranslationsExplored ?? 0}
                                weight={"1"}
                                level={"1"}
                                className={"text-accent"}
                            />
                            {/* TODO: добавить экраны */}
                            {/* <Icon24ChevronRight className={"text-secondary -mr-[3px]"} /> */}
                        </div>
                    </div>
                    <div
                        className={
                            "bg-vk-secondary p-3 rounded-xl h-[76px] box-border cursor-pointer justify-between flex-col"
                        }
                    >
                        <Caption level={"1"} weight={"2"} children={"Всего изучено слов"} />
                        <div className={"flex justify-between items-center"}>
                            <Title
                                children={userData?.stats.totalTranslationsExplored ?? 0}
                                weight={"1"}
                                level={"1"}
                                className={"text-accent"}
                            />
                            {/* TODO: добавить экраны */}
                            {/* <Icon24ChevronRight className={"text-secondary -mr-[3px]"} /> */}
                        </div>
                    </div>
                </div>
            </div>
            <ModalWrapper isOpened={leaderboardModal.isOpened} onClose={leaderboardModal.close}>
                <ModalBody fullscreen>
                    <Leaderboard onClose={leaderboardModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
