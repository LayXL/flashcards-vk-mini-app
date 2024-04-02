import bridge from "@vkontakte/vk-bridge"
import { ModalPageHeader, PanelHeaderBack, Tabs, TabsItem } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { RatingUserCard } from "../entities/rating/ui/rating-user-card"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"

type LeaderboardProps = {
    onClose: () => void
}

export const Leaderboard = ({ onClose }: LeaderboardProps) => {
    const [tab, setTab] = useState<"friends" | "global">("friends")
    const [frinedsIds, setFriendsIds] = useState<number[] | null>(null)

    // TODO придумать что выводить, если нет друзей, играющие в этот сезон

    const { data: leaderboardData } = trpc.rating.getLeaderboard.useQuery({
        users: tab === "global" ? undefined : frinedsIds ?? [],
    })
    const { data: currentUser } = trpc.getUser.useQuery()

    useEffect(() => {
        if (tab !== "friends") return

        bridge
            .send("VKWebAppGetAuthToken", {
                app_id: 51843841,
                scope: "friends",
            })
            .then((data) => {
                if (!data.access_token) return

                bridge
                    .send("VKWebAppCallAPIMethod", {
                        method: "friends.get",
                        params: {
                            user_id: parseInt(currentUser?.vkId ?? "0"),
                            v: "5.131",
                            access_token: data.access_token,
                        },
                    })
                    .then((data) => {
                        if (!data.response?.items) return
                        setFriendsIds(data.response.items)
                    })
            })
    }, [currentUser?.vkId, tab])

    return (
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

            {leaderboardData?.map(({ user, points }, i) => (
                <RatingUserCard
                    key={i}
                    avatar={getSuitableAvatarUrl(user.avatarUrls, 64)}
                    name={user.fullName}
                    points={points}
                    place={i + 1}
                    isCurrentUser={user.id === currentUser?.id}
                />
            ))}
        </>
    )
}
