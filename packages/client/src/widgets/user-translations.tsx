import { Button, Card, CardGrid, Div, PanelSpinner, Tappable, Title } from "@vkontakte/vkui"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { trpc } from "../shared/api"

export const UserTranslations = () => {
    const modalHistory = useModalHistory()

    const { data: userTranslations, isLoading } = trpc.translations.getUserTranslations.useQuery()

    return (
        <>
            <Div>
                <Button
                    stretched
                    size="l"
                    children={"Добавить перевод"}
                    onClick={() => modalHistory.openModal("translationAdd")}
                />
            </Div>

            {isLoading && <PanelSpinner />}

            {userTranslations?.map((translation) => (
                <Div key={translation.id}>
                    <Tappable onClick={() => {}} activeMode={"opacity"}>
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
