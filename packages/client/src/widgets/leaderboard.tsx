import { FloatingPortal } from "@floating-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Icon56UsersOutline } from "@vkontakte/icons"
import {
    Button,
    ModalPageHeader,
    PanelHeaderBack,
    Placeholder,
    Spacing,
    Tabs,
    TabsItem,
} from "@vkontakte/vkui"
import { useState } from "react"
import { PrizePlace } from "../entities/rating/ui/prize-place"
import { RatingUserCard } from "../entities/rating/ui/rating-user-card"
import { useModal } from "../features/modal/contexts/modal-context"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { getFriends } from "../shared/helpers/getFriends"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"

type LeaderboardProps = {
    onClose?: () => void
    minimized?: boolean
    defaultTab?: "friends" | "global"
}

export const Leaderboard = ({ onClose, minimized, defaultTab }: LeaderboardProps) => {
    const [tab, setTab] = useState<"friends" | "global">(defaultTab || "global")

    const modal = useModal()

    const { data: currentUserSeason } = trpc.rating.getCurrentSeason.useQuery()
    const { data: currentUser } = trpc.getUser.useQuery()

    const {
        data: friendsData,
        refetch: refetchFriends,
        isError,
        isPending,
        isSuccess,
    } = useQuery({
        queryKey: ["friends"],
        queryFn: () => getFriends(parseInt(currentUser?.vkId ?? "0")),
        enabled: tab === "friends" && !!currentUser,
        retry: false,
    })

    const { data: leaderboardData } = trpc.rating.getLeaderboard.useQuery(
        {
            users: tab === "global" ? undefined : friendsData?.friends ?? [],
        },
        {
            enabled: tab === "global" || (tab === "friends" && friendsData?.friends !== null),
        }
    )

    return (
        <div className={cn(!minimized && "h-full flex flex-col")}>
            {!minimized && (
                <>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={onClose} />}
                        children={"Таблица лидеров"}
                    />
                    <Tabs>
                        <TabsItem
                            children={"Общий"}
                            onClick={() => setTab("global")}
                            selected={tab === "global"}
                        />
                        <TabsItem
                            children={"Среди друзей"}
                            onClick={() => setTab("friends")}
                            selected={tab === "friends"}
                        />
                    </Tabs>
                </>
            )}

            <div className={"h-full overflow-scroll"}>
                {(leaderboardData?.length ?? 10) <= 1 && tab === "friends" && isSuccess && (
                    <Placeholder
                        className={"h-2/3"}
                        icon={<Icon56UsersOutline />}
                        header={"Здесь пусто"}
                        children={"Пока нет друзей, которые играли в рейтинг"}
                    />
                )}

                {(friendsData?.friends.length === 0 || isError || isPending) &&
                    tab === "friends" && (
                        <Placeholder
                            icon={<Icon56UsersOutline />}
                            header={"Мы не знаем кто ваши друзья"}
                            children={
                                "Пожалуйста, разрешите доступ к друзьям, чтобы посмотреть таблицу лидеров среди друзей"
                            }
                            action={
                                <Button
                                    loading={isPending}
                                    onClick={() => refetchFriends()}
                                    children={"Разрешить"}
                                    size={"l"}
                                />
                            }
                        />
                    )}

                {(leaderboardData?.length ?? 0) >= 2 && (
                    <div className={"flex gap-2 justify-around items-center py-3"}>
                        {[1, 0, 2].map((i) => (
                            <div className={"flex-1"} key={i}>
                                {leaderboardData?.slice(0, 3)[i] && (
                                    <PrizePlace
                                        place={i + 1}
                                        name={leaderboardData?.slice(0, 3)[i].user.fullName}
                                        points={leaderboardData?.slice(0, 3)[i].points}
                                        avatarUrl={getSuitableAvatarUrl(
                                            leaderboardData?.slice(0, 3)[i].user.avatarUrls,
                                            64
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* TODO проверить работу */}
                {leaderboardData
                    ?.slice(3, minimized ? 10 : undefined)
                    .map(({ user, points }, i) => (
                        <RatingUserCard
                            key={user.id}
                            avatar={
                                user.avatarUrls
                                    ? getSuitableAvatarUrl(user.avatarUrls, 64)
                                    : undefined
                            }
                            name={user.fullName}
                            points={points}
                            place={i + 4}
                            isCurrentUser={user.id === currentUser?.id}
                        />
                    ))}

                {!minimized && <Spacing size={128} />}
            </div>

            {!minimized && currentUser && currentUserSeason?.user.place && tab === "global" && (
                <FloatingPortal>
                    <div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 p-3 mb-safe-area-bottom flex flex-col items-center",
                            modal?.isOpenedAnimation
                                ? "animate-content-appearing"
                                : "animate-content-disappearing"
                        )}
                    >
                        <div className={"bg-vk-secondary rounded-xl max-w-[540px] w-full"}>
                            <RatingUserCard
                                avatar={getSuitableAvatarUrl(currentUser.avatarUrls, 64)}
                                name={currentUser.fullName ?? ""}
                                points={currentUserSeason.user.points}
                                place={currentUserSeason.user.place}
                                isCurrentUser={true}
                            />
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </div>
    )
}
