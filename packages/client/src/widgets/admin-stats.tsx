import { Card, CardGrid, Group, Header, Headline, Spacing, Title } from "@vkontakte/vkui"
import { trpc } from "../shared/api"

export const AdminStats = () => {
    const { data } = trpc.stats.getAdminStats.useQuery()

    return (
        <>
            <Group>
                <Header children={"Пользователи"} />
                <CardGrid size={"l"}>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.users.online} />
                            <Headline className={"opacity-60"} children={"Онлайн"} />
                        </div>
                    </Card>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.users.today} />
                            <Headline
                                className={"opacity-60"}
                                children={"Пользователей за сегодня"}
                            />
                        </div>
                    </Card>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.users.total} />
                            <Headline className={"opacity-60"} children={"Всего пользователей"} />
                        </div>
                    </Card>
                </CardGrid>
            </Group>
            <Group>
                <Header children={"Переводы"} />
                <CardGrid size={"l"}>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.translations.today} />
                            <Headline className={"opacity-60"} children={"Переводов за сегодня"} />
                        </div>
                    </Card>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.translations.total} />
                            <Headline className={"opacity-60"} children={"Всего переводов"} />
                        </div>
                    </Card>
                </CardGrid>
            </Group>
            <Group>
                <Header children={"Коллекции"} />
                <CardGrid size={"l"}>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.stacks.today} />
                            <Headline className={"opacity-60"} children={"Коллекций за сегодня"} />
                        </div>
                    </Card>
                    <Card>
                        <div className={"p-4 flex flex-col gap-1"}>
                            <Title children={data?.stacks.total} />
                            <Headline className={"opacity-60"} children={"Всего коллекций"} />
                        </div>
                    </Card>
                </CardGrid>
            </Group>
            <Spacing size={72} />
        </>
    )
}
