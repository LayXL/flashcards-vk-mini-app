import {
    Button,
    Caption,
    Div,
    Group,
    Header,
    Headline,
    PanelHeader,
    Spacing,
} from "@vkontakte/vkui"
import { useWindowSize } from "usehooks-ts"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { useModalState } from "../shared/hooks/useModalState"
import { DailyStreak } from "../widgets/daily-streak"
import { FiveLetters } from "../widgets/five-letters"
import { Stats } from "../widgets/stats"
import { StoriesFeed } from "../widgets/stories-feed"

export const Home = () => {
    const fiveLettersModal = useModalState()

    const windowSize = useWindowSize()

    const stats = (
        <Group>
            <Header children={"Статистика"} />

            <Div>
                <Stats />
            </Div>
        </Group>
    )

    const daily = (
        <Group>
            <Header children={"Ежедневное задание"} />

            <Div>
                <div
                    className={
                        "bg-vk-accent flex-col gap-3 p-3 rounded-xl cursor-pointer text-white"
                    }
                    onClick={fiveLettersModal.open}
                >
                    <Headline weight={"2"} children={"Сыграйте в игру 5 букв"} />
                    <div className={"flex items-center"}>
                        <Caption
                            className={"flex-1"}
                            children={"Попробуй угадать слово за шесть попыток"}
                        />
                        <Button
                            className={"!bg-white !text-black"}
                            children={"Играть"}
                            mode={"primary"}
                        />
                    </div>
                </div>
            </Div>
        </Group>
    )

    return (
        <>
            <PanelHeader children={"Лёрнинг"} />

            <SearchBar />

            <Group>
                <StoriesFeed />
            </Group>

            <Group>
                <Header children={"Ударный режим"} />
                <DailyStreak />
            </Group>

            {windowSize.width <= 768 ? (
                <>
                    {stats}
                    {daily}
                </>
            ) : (
                <div className={"grid md:grid-cols-2 gap-x-4"}>
                    <div children={stats} />
                    <div children={daily} />
                </div>
            )}

            <Spacing size={128} />

            <ModalWrapper isOpened={fiveLettersModal.isOpened} onClose={fiveLettersModal.close}>
                <ModalBody fullscreen>
                    <FiveLetters onClose={fiveLettersModal.close} />
                </ModalBody>
            </ModalWrapper>

            <TabBar />
        </>
    )
}
