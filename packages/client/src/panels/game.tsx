import { Icon28AddCircleOutline } from "@vkontakte/icons"
import { PanelHeader, PanelHeaderButton } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { useModalState } from "../shared/hooks/useModalState"
import { CreateContent } from "../widgets/create-content"
import { DailyStreak } from "../widgets/daily-streak"
import { SelectGame } from "../widgets/select-game"

export const Game = () => {
    const createContentModal = useModalState()

    return (
        <>
            <PanelHeader
                children={"Играть"}
                before={<DailyStreak />}
                after={
                    <PanelHeaderButton
                        children={<Icon28AddCircleOutline />}
                        onClick={createContentModal.open}
                    />
                }
            />

            <SelectGame />

            <TabBar />

            <CreateContent {...createContentModal} />
        </>
    )
}
