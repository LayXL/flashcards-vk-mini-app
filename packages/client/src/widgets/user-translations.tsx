import { Button, Div, PanelSpinner, Spacing } from "@vkontakte/vkui"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationAdd } from "./translation-add"

export const UserTranslations = () => {
    const { data: userTranslations, isLoading } = trpc.translations.getUserTranslations.useQuery()

    const addTranslationModal = useModalState()

    return (
        <>
            <Div>
                <Button
                    stretched={true}
                    size={"l"}
                    children={"Добавить перевод"}
                    onClick={addTranslationModal.open}
                />
            </Div>

            {isLoading && <PanelSpinner />}

            {userTranslations?.map((translation) => (
                <Div key={translation.id}>
                    <TranslationCard
                        id={translation.id}
                        vernacular={translation.vernacular}
                        foreign={translation.foreign}
                    />
                </Div>
            ))}

            <Spacing size={256} />

            <ModalWrapper
                isOpened={addTranslationModal.isOpened}
                onClose={addTranslationModal.close}
            >
                <ModalBody>
                    <TranslationAdd onClose={addTranslationModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
