import { Search } from "@vkontakte/vkui"
import { ModalWrapper } from "../../modal/ui/modal-wrapper"
import { ModalBody } from "../../modal/ui/modal-body"
import { Search as SearchWidget } from "../../../widgets/search"
import { useModalState } from "../../../shared/hooks/useModalState"

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
