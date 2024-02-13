import { Button, Card, CardGrid, Div, PanelSpinner, Tappable, Title } from "@vkontakte/vkui"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { trpc } from "../shared/api"
import { useResetRecoilState, useSetRecoilState } from "recoil"
import { newTranslation } from "../shared/store"

export const UserTranslations = () => {
    const modalHistory = useModalHistory()

    const setTranslationData = useSetRecoilState(newTranslation)
    const resetTranslationData = useResetRecoilState(newTranslation)

    const { data: userTranslations, isLoading } = trpc.translations.getUserTranslations.useQuery()

    return (
        <>
            <Div>
                <Button
                    stretched
                    size="l"
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
                    <Tappable
                        onClick={() => {
                            setTranslationData({
                                isEditing: true,
                                translationId: translation.id,
                                vernacular: translation.vernacular,
                                foreign: translation.foreign,
                                example: translation.example,
                                tags: translation.tags.map((x) => x.name),
                                transcriptions: translation.transcriptions.map((transcription) => ({
                                    id: transcription.id,
                                    transcription: transcription.transcription,
                                    languageVariationId: transcription.languageVariationId,
                                })),
                                languageId: translation.languageId,
                                languageVariationId: translation.languageVariationId,
                            })
                            modalHistory.openModal("translationAdd")
                        }}
                        activeMode={"opacity"}
                    >
                        <Card mode="outline" style={{ padding: 16, height: 96 }}>
                            <Title>{translation.vernacular}</Title>
                            <Title>{translation.foreign}</Title>
                        </Card>
                    </Tappable>
                </Div>
            ))}
        </>
    )
}
