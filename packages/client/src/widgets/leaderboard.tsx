import { Icon56UsersOutline } from "@vkontakte/icons"
import { ModalPageHeader, PanelHeaderBack, Placeholder, Tabs, TabsItem } from "@vkontakte/vkui"
import { useState } from "react"
import { RatingUserCard } from "../entities/rating/ui/rating-user-card"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"

type LeaderboardProps = {
    onClose: () => void
}

export const Leaderboard = ({ onClose }: LeaderboardProps) => {
    const { data: leaderboardData } = trpc.rating.getLeaderboard.useQuery()
    const { data: currentUser } = trpc.getUser.useQuery()

    const [tab, setTab] = useState<"friends" | "global">("global")

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

            {tab === "global" &&
                leaderboardData?.map(({ user, points }, i) => (
                    <RatingUserCard
                        key={i}
                        avatar={getSuitableAvatarUrl(user.avatarUrls, 64)}
                        name={user.fullName}
                        points={points}
                        place={i + 1}
                        isCurrentUser={user.id === currentUser?.id}
                    />
                ))}

            {tab === "friends" && (
                <Placeholder
                    stretched={true}
                    icon={<Icon56UsersOutline />}
                    header={"В разработке"}
                    children={"Раздел с рейтингом друзей сейчас в разработке"}
                />
            )}
        </>
    )
}
