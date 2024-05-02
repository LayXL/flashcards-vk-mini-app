import { PanelHeader } from "@vkontakte/vkui"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { Leaderboard } from "../widgets/leaderboard"
import { SelectGame } from "../widgets/select-game"

export const Game = () => {
    const { data: dailyStreak } = trpc.stats.getDailyStreak.useQuery()

    const ratingModal = useModalState()

    return (
        <>
            <PanelHeader
                children={"Игровые режимы"}
                before={<span children={dailyStreak?.streakCount ?? ":("} />}
            />

            <SelectGame />

            <TabBar />

            <ModalWindow {...ratingModal} fullscreen={true} disableDragToClose>
                <Leaderboard onClose={ratingModal.close} />
            </ModalWindow>
        </>
    )
}
