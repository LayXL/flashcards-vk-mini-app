import { PanelHeader, Paragraph, Div, Button } from "@vkontakte/vkui"
import { useModalHistory } from "../shared/hooks/useModalHistory"

export const Home = () => {
    const modalHistory = useModalHistory()

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Div>
                <Paragraph>Это главная страница</Paragraph>
            </Div>

            <Div>
                <Button
                    children={"Добавить перевод"}
                    onClick={() => modalHistory.openModal("translationAdd")}
                />
            </Div>
        </>
    )
}
