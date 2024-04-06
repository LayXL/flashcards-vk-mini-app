import {
    Icon24Play,
    Icon28Cards2Outline,
    Icon28CupOutline,
    Icon28Like,
    Icon28LikeFillRed,
} from "@vkontakte/icons"
import {
    Button,
    ButtonGroup,
    Div,
    Group,
    PanelHeader,
    Placeholder,
    Spacing,
    Tabs,
    TabsItem,
    Title,
} from "@vkontakte/vkui"
import { useState } from "react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "../widgets/game-results"
import { Leaderboard } from "../widgets/leaderboard"
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
    const ratingModal = useModalState()

    const [type, setType] = useState<"default" | "ranked">("default")

    const { data: ratingAttemptsLeft } = trpc.game.getRatingAttemptsLeftToday.useQuery(undefined, {
        enabled: type === "ranked",
    })

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
                    {/* TODO: изменить раздел */}
                    {/* <Group>
                        <Header children={"Недавние игры"} />
                        <Div className={"flex-col gap-2"}>
                            {recentlyGames?.map((game) => (
                                <RecentGameCard key={game.id} id={game.id} />
                            ))}
                        </Div>
                    </Group> */}
                </>
            )}

            {type === "ranked" && (
                <>
                    <Group>
                        <Div className={"flex justify-between"}>
                            <Title children={"Попытки на сегодня"} level={"3"} weight={"2"} />
                            <div className={"flex gap-1.5 text-dynamic-red"}>
                                {Array.from({ length: ratingAttemptsLeft ?? 0 }).map((_, i) => (
                                    <Icon28LikeFillRed key={i} />
                                ))}
                                {Array.from({ length: 3 - (ratingAttemptsLeft ?? 0) }).map(
                                    (_, i) => (
                                        <Icon28Like key={i} className={"text-secondary"} />
                                    )
                                )}
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
                                    Получай баллы и&nbsp;поднимайся в&nbsp;таблице лидеров
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
                        <Leaderboard minimized defaultTab={"global"} />
                        <Div>
                            <Button
                                mode={"outline"}
                                children={"Перейти к рейтингу"}
                                onClick={ratingModal.open}
                                stretched
                                size={"l"}
                                className={"max-w-96 mx-auto"}
                            />
                        </Div>
                        <Spacing size={128} />
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
            <ModalWindow {...ratingModal} fullscreen={true}>
                <Leaderboard onClose={ratingModal.close} />
            </ModalWindow>
        </>
    )
}
