import { useQuery } from "@tanstack/react-query"
import {
    Button,
    ModalPageHeader,
    PanelHeaderBack,
    Placeholder,
    Tabs,
    TabsItem,
} from "@vkontakte/vkui"
import { useState } from "react"
import { PrizePlace } from "../entities/rating/ui/prize-place"
import { RatingUserCard } from "../entities/rating/ui/rating-user-card"
import { trpc } from "../shared/api"
import { getFriends } from "../shared/helpers/getFriends"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"

type LeaderboardProps = {
    onClose?: () => void
    minimized?: boolean
    defaultTab?: "friends" | "global"
}

export const Leaderboard = ({ onClose, minimized, defaultTab }: LeaderboardProps) => {
    const [tab, setTab] = useState<"friends" | "global">(defaultTab || "friends")

    const { data: currentUser } = trpc.getUser.useQuery()

    const { data: friendsData, refetch: refetchFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: () => getFriends(parseInt(currentUser?.vkId ?? "0")),
        enabled: tab === "friends" || !!currentUser,
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
        <>
            {!minimized && (
                <>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={onClose} />}
                        children={"Таблица лидеров"}
                    />
                    <Tabs>
                        <TabsItem
                            children={"Среди друзей"}
                            onClick={() => setTab("friends")}
                            selected={tab === "friends"}
                        />
                        <TabsItem
                            children={"Общий"}
                            onClick={() => setTab("global")}
                            selected={tab === "global"}
                        />
                    </Tabs>
                </>
            )}

            <div className={"flex gap-2 justify-around items-center py-3"}>
                {[1, 0, 2].map((i) => (
                    <div className={"flex-1"}>
                        {leaderboardData?.slice(0, 3)[i] && (
                            <PrizePlace
                                key={i}
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

            {/* TODO проверить работу */}
            {leaderboardData?.slice(3, minimized ? 10 : undefined).map(({ user, points }, i) => (
                <RatingUserCard
                    key={i}
                    avatar={getSuitableAvatarUrl(user.avatarUrls, 64)}
                    name={user.fullName}
                    points={points}
                    place={i + 4}
                    isCurrentUser={user.id === currentUser?.id}
                />
            ))}

            {friendsData?.friends.length === 0 && tab === "friends" && (
                <Placeholder
                    header={"Мы не знаем кто ваши друзья"}
                    children={
                        "Пожалуйста, разрешите доступ к друзьям, чтобы посмотреть таблицу лидеров среди друзей"
                    }
                    action={<Button onClick={refetchFriends} children={"Разрешить"} size={"l"} />}
                />
            )}
        </>
    )
}
