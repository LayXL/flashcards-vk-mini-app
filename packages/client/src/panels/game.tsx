import { PanelHeader } from "@vkontakte/vkui"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { useModalState } from "../shared/hooks/useModalState"
import { DailyStreak } from "../widgets/daily-streak"
import { Leaderboard } from "../widgets/leaderboard"
import { SelectGame } from "../widgets/select-game"

export const Game = () => {
    const ratingModal = useModalState()

    return (
        <>
            <PanelHeader children={"Игровые режимы"} before={<DailyStreak />} />

            <SelectGame />

            <TabBar />

            <ModalWindow {...ratingModal} fullscreen={true} disableDragToClose>
                <Leaderboard onClose={ratingModal.close} />
            </ModalWindow>
        </>
    )
}
