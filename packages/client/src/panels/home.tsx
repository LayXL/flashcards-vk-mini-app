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
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { DailyStreak } from "../widgets/daily-streak"
import { FiveLetters } from "../widgets/five-letters"
import { Stats } from "../widgets/stats"

export const Home = () => {
    trpc.updateInfo.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const fiveLettersModal = useModalState()

    return (
        <>
            <PanelHeader children={"Лёрнинг"} />

            <SearchBar />

            <Group>
                <Header children={"Ударный режим"} />

                <DailyStreak />
            </Group>

            <Group>
                <Header children={"Статистика"} />

                <Div>
                    <Stats />
                </Div>
            </Group>

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
                            <Button children={"Играть"} mode={"primary"} />
                        </div>
                    </div>
                </Div>
            </Group>

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
