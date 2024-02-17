import { Search } from "@vkontakte/vkui"
import { useModalState } from "../../../shared/hooks/useModalState"
import { Search as SearchWidget } from "../../../widgets/search"
import { ModalBody } from "../../modal/ui/modal-body"
import { ModalWrapper } from "../../modal/ui/modal-wrapper"

export const SearchBar = () => {
    const { isOpened, close, open } = useModalState(false)

    return (
        <>
            <Search onClick={open} onChange={open} value={""} />
            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <SearchWidget onClose={close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
