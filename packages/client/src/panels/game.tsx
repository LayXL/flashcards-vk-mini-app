import {
    Icon24Play,
    Icon28Cards2Outline,
    Icon28CupOutline,
    Icon28LikeFillRed,
} from "@vkontakte/icons"
import {
    Button,
    ButtonGroup,
    Div,
    Group,
    Header,
    PanelHeader,
    Placeholder,
    Tabs,
    TabsItem,
    Title,
} from "@vkontakte/vkui"
import { useState } from "react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "../widgets/game-results"
import { PlayGame } from "../widgets/play-game"
import { PlayRankedGame } from "../widgets/play-ranked-game"

const RecentGameCard = ({ id }: { id: number }) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <div onClick={open} className={"p-3 bg-secondary rounded-xl cursor-pointer"}>
                {id}
            </div>

            {/* TODO: создается слишком много порталов, заменить на стейт и выводить всего один модал враппер */}
            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <GameResults id={id} onClose={close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}

export const Game = () => {
    const { data: recentlyGames } = trpc.game.getRecentlyGames.useQuery()

    const playGameModal = useModalState()

    const [type, setType] = useState<"default" | "ranked">("default")

    return (
        <>
            <PanelHeader children={"Играть"} />

            <Tabs>
                <TabsItem
                    onClick={() => setType("default")}
                    selected={type === "default"}
                    children={"Обычная игра"}
                />
                <TabsItem
                    onClick={() => setType("ranked")}
                    selected={type === "ranked"}
                    children={"Рейтинг"}
                />
            </Tabs>

            {type === "default" && (
                <>
                    <Group>
                        <Placeholder
                            icon={
                                <Icon28Cards2Outline
                                    width={56}
                                    height={56}
                                    className={"text-accent"}
                                />
                            }
                            header={"Закрепляй знания"}
                            children={
                                <span className={"text-balance"}>
                                    Узнавай новые слова и&nbsp;запоминай старые с&nbsp;помощью игры,
                                    где&nbsp;нужно на&nbsp;время выбирать правильный перевод
                                </span>
                            }
                            action={
                                <ButtonGroup mode={"vertical"} align={"center"}>
                                    <Button
                                        before={<Icon24Play />}
                                        size={"l"}
                                        children={"Начать игру"}
                                        onClick={playGameModal.open}
                                    />
                                </ButtonGroup>
                            }
                        />
                    </Group>
                    <Group>
                        <Header children={"Недавние игры"} />
                        <Div className={"flex-col gap-2"}>
                            {recentlyGames?.map((game) => (
                                <RecentGameCard key={game.id} id={game.id} />
                            ))}
                        </Div>
                    </Group>
                </>
            )}

            {type === "ranked" && (
                <>
                    <Group>
                        {/* TODO попытки */}
                        <Div className={"flex justify-between"}>
                            <Title children={"Попытки на сегодня"} level={"3"} weight={"2"} />
                            <div className={"flex gap-1.5 text-dynamic-red"}>
                                <Icon28LikeFillRed />
                                <Icon28LikeFillRed />
                                <Icon28LikeFillRed />
                            </div>
                        </Div>
                        <Placeholder
                            icon={
                                <Icon28CupOutline
                                    width={56}
                                    height={56}
                                    className={"text-accent"}
                                />
                            }
                            header={"Соревнуйся"}
                            children={
                                <span className={"text-balance"}>
                                    {/* TODO */}
                                    Здесь должно быть описание рейтингового режима
                                </span>
                            }
                            action={
                                <ButtonGroup mode={"vertical"} align={"center"}>
                                    <Button
                                        before={<Icon24Play />}
                                        size={"l"}
                                        children={"Начать игру"}
                                        onClick={playGameModal.open}
                                    />
                                </ButtonGroup>
                            }
                        />
                    </Group>
                </>
            )}

            <TabBar />

            <ModalWrapper isOpened={playGameModal.isOpened} onClose={playGameModal.close}>
                <ModalBody fullscreen={true}>
                    {type === "default" && <PlayGame onClose={playGameModal.close} />}
                    {type === "ranked" && <PlayRankedGame onClose={playGameModal.close} />}
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
