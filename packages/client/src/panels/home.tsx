import { PanelHeader, Paragraph, Div } from "@vkontakte/vkui"

export const Home = () => {
    // const routeNavigator = useRouteNavigator()

    // const { isLoading } = trpc.healthCheck.useQuery()

    // if (isLoading) return

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Div>
                <Paragraph>Это главная страница</Paragraph>
            </Div>
        </>
    )
}
