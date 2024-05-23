import { Icon24AddOutline, Icon28HieroglyphCharacterOutline } from "@vkontakte/icons"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Button, ButtonGroup, Placeholder } from "@vkontakte/vkui"

export const NotFoundCollection = () => {
    const routeNavigator = useRouteNavigator()

    return (
        <Placeholder
            icon={<Icon28HieroglyphCharacterOutline height={56} width={56} />}
            header={"Не нашли подходящую коллекцию?"}
            children={
                "Вы можете найти коллекции от других пользователей или же создать собственные"
            }
            action={
                <ButtonGroup mode={"vertical"} align={"center"}>
                    <Button
                        size={"l"}
                        children={"Перейти в ленту"}
                        onClick={() => routeNavigator.push("/new")}
                    />
                    <Button
                        size={"l"}
                        mode={"tertiary"}
                        children={"Создать свою коллекцию"}
                        before={<Icon24AddOutline />}
                        onClick={() => routeNavigator.push("/profile")}
                    />
                </ButtonGroup>
            }
        />
    )
}
