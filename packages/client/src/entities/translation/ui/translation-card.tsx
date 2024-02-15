import { Div, Tappable, Card, Title } from "@vkontakte/vkui"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { useState } from "react"
import { TranslationViewModal } from "../../../widgets/translation-view-modal"

type TranslationCardProps = {
    id: number
    vernacular: string
    foreign: string
}

export const TranslationCard = ({ id, vernacular, foreign }: TranslationCardProps) => {
    const [isOpened, setIsOpened] = useState(false)

    return (
        <>
            <Div>
                <Tappable onClick={() => setIsOpened(true)} activeMode={"opacity"}>
                    <Card mode="outline" style={{ padding: 16, height: 96 }}>
                        <Title>{vernacular}</Title>
                        <Title>{foreign}</Title>
                    </Card>
                </Tappable>
            </Div>
            <ModalWrapper isOpened={isOpened} onClose={() => setIsOpened(false)}>
                <TranslationViewModal id={id} />
            </ModalWrapper>
        </>
    )
}
