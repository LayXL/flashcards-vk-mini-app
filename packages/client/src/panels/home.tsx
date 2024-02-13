import { PanelHeader, Paragraph, Div, Button, FixedLayout } from "@vkontakte/vkui"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { TabBar } from "../features/tab-bar/ui/tab-bar"

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

            <FixedLayout vertical="bottom" filled>
                <Div>
                    <Paragraph>123</Paragraph>
                </Div>
            </FixedLayout>
        </>
    )
}
