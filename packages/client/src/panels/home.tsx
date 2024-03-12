import { Div, PanelHeader } from "@vkontakte/vkui"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { FiveLetters } from "../widgets/five-letters"

export const Home = () => {
    trpc.updateInfo.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const fiveLettersModal = useModalState()

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <SearchBar />

            <Div>
                <div
                    className="p-3 h-[144px] bg-vk-secondary rounded-xl cursor-pointer shadow-card"
                    onClick={() => fiveLettersModal.open()}
                >
                    <p className="font-semibold text-2xl">Пять букв</p>
                </div>
            </Div>

            <ModalWrapper isOpened={fiveLettersModal.isOpened} onClose={fiveLettersModal.close}>
                <ModalBody fullscreen>
                    <FiveLetters onClose={fiveLettersModal.close} />
                </ModalBody>
            </ModalWrapper>

            <TabBar />
        </>
    )
}
