import { PanelHeader } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { DailyStreak } from "../widgets/daily-streak"
import { SelectGame } from "../widgets/select-game"

export const Game = () => {
    return (
        <>
            <PanelHeader children={"Играть"} before={<DailyStreak />} />

            <SelectGame />

            <TabBar />
        </>
    )
}
