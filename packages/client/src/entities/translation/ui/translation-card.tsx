import { Card, Tappable, Title } from "@vkontakte/vkui"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { useModalState } from "../../../shared/hooks/useModalState"
import { TranslationView } from "../../../widgets/translation-view"
import { ModalBody } from "../../../features/modal/ui/modal-body"

type TranslationCardProps = {
    id: number
    vernacular: string
    foreign: string
}

export const TranslationCard = ({ id, vernacular, foreign }: TranslationCardProps) => {
    const { isOpened, close, open } = useModalState()

    return (
        <>
            <Tappable onClick={open} activeMode={"opacity"}>
                <Card mode={"outline"} style={{ padding: 16, height: 96 }}>
                    <Title>{vernacular}</Title>
                    <Title>{foreign}</Title>
                </Card>
            </Tappable>
            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody>
                    <TranslationView id={id} onClose={close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
