import { Button, Div, PanelSpinner } from "@vkontakte/vkui"
import { useResetRecoilState } from "recoil"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { trpc } from "../shared/api"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { newTranslation } from "../shared/store"

export const UserTranslations = () => {
    const modalHistory = useModalHistory()

    const resetTranslationData = useResetRecoilState(newTranslation)

    const { data: userTranslations, isLoading } = trpc.translations.getUserTranslations.useQuery()

    return (
        <>
            <Div>
                <Button
                    stretched={true}
                    size={"l"}
                    children={"Добавить перевод"}
                    onClick={() => {
                        resetTranslationData()
                        modalHistory.openModal("translationAdd")
                    }}
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
        </>
    )
}
