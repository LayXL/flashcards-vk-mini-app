import { ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { RatingUserCard } from "../entities/rating/ui/rating-user-card"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"

type LeaderboardProps = {
    onClose: () => void
}

export const Leaderboard = ({ onClose }: LeaderboardProps) => {
    const { data: leaderboardData } = trpc.rating.getLeaderboard.useQuery()

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Таблица лидеров"}
            />

            {leaderboardData?.map(({ user, points }, i) => (
                <RatingUserCard
                    key={i}
                    avatar={getSuitableAvatarUrl(user.avatarUrls, 64)}
                    name={user.fullName}
                    points={points}
                    place={i + 1}
                />
            ))}
        </>
    )
}
