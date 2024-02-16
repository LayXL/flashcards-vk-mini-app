import { Tappable, Card, Title } from "@vkontakte/vkui"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { TranslationView } from "../../../widgets/translation-view"
import { useModalState } from "../../../shared/hooks/useModalState"

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
                <Card mode="outline" style={{ padding: 16, height: 96 }}>
                    <Title>{vernacular}</Title>
                    <Title>{foreign}</Title>
                </Card>
            </Tappable>
            <ModalWrapper isOpened={isOpened} onClose={close}>
                <TranslationView id={id} onClose={close} />
            </ModalWrapper>
        </>
    )
}
