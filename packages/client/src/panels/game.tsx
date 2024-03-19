import { Icon24Play, Icon28Cards2Outline } from "@vkontakte/icons"
import { Button, ButtonGroup, Div, Header, PanelHeader, Placeholder } from "@vkontakte/vkui"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "../widgets/game-results"
import { PlayGame } from "../widgets/play-game"

const RecentGameCard = ({ id }: { id: number }) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <div onClick={open} className={"p-3 bg-secondary rounded-xl cursor-pointer"}>
                {id}
            </div>

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

    return (
        <>
            <PanelHeader children={"Играть"} />

            <Placeholder
                icon={<Icon28Cards2Outline width={56} height={56} className={"text-accent"} />}
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

            <Header>Недавние игры</Header>

            <Div className={"flex-col gap-2"}>
                {recentlyGames?.map((game) => (
                    <RecentGameCard key={game.id} id={game.id} />
                ))}
            </Div>

            <TabBar />

            <ModalWrapper isOpened={playGameModal.isOpened} onClose={playGameModal.close}>
                <ModalBody fullscreen={true}>
                    <PlayGame onClose={playGameModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
