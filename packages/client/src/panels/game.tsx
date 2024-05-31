import { Icon28AddCircleOutline } from "@vkontakte/icons"
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge"
import { PanelHeader, PanelHeaderButton } from "@vkontakte/vkui"
import { useTimeout } from "usehooks-ts"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { useModalState } from "../shared/hooks/useModalState"
import { CreateContent } from "../widgets/create-content"
import { DailyStreak } from "../widgets/daily-streak"
import { SelectGame } from "../widgets/select-game"

export const Game = ({ openFiveLetters }: { openFiveLetters?: boolean }) => {
    const createContentModal = useModalState()

    useTimeout(() => {
        bridge.send("VKWebAppShowBannerAd", { banner_location: BannerAdLocation.BOTTOM })
    }, 2000)

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

            <SelectGame openFiveLetters={openFiveLetters} />

            <TabBar />

            <CreateContent {...createContentModal} />
        </>
    )
}
