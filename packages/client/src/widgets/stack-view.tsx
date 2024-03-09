import {
    Button,
    ButtonGroup,
    CellButton,
    Div,
    Header,
    IconButton,
    ModalPageHeader,
    PanelHeaderBack,
    Subhead,
} from "@vkontakte/vkui"
import { Fragment } from "react"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { useModal } from "../features/modal/contexts/modal-context"
import { trpc } from "../shared/api"
import {
    Icon24Add,
    Icon24Like,
    Icon24LikeOutline,
    Icon24MoreHorizontal,
    Icon28MoreHorizontal,
} from "@vkontakte/icons"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"

type StackViewProps = {
    id: number
}

export const StackView = ({ id }: StackViewProps) => {
    const modal = useModal()
    const { data, refetch } = trpc.stacks.getSingle.useQuery({ id })

    const { mutate: deleteTranslationFromStack } = trpc.stacks.removeTranslation.useMutation({
        onSuccess: () => refetch(),
    })

    const {mutate: addReaction} = trpc.stacks.addReaction.useMutation({
        onSuccess: () => refetch(),
    })

    const {mutate: removeReaction} = trpc.stacks.removeReaction.useMutation({
        onSuccess: () => refetch(),
    })

    return (
        <>
            <ModalPageHeader className="z-20"
                before={<PanelHeaderBack onClick={() => modal?.onClose()} />}
                children={data?.name}
            />

            <div className="flex flex-col relative ">
                <div className="absolute bg-blue-300 w-[360px] aspect-square -z-1 left-1/2 -translate-x-1/2 opacity-50 -top-[260px] rounded-full blur-3xl"></div>
                <div className="flex flex-row items-center justify-center gap-6 py-3 z-20">
                    <div className="rounded-full p-2.5 bg-vk-default text-accent">
                        <Icon24MoreHorizontal />
                    </div>
                    <div className="w-[200px] aspect-square bg-vk-default rounded-xl"></div>
                    <div className="rounded-full p-2.5 bg-vk-default text-accent" onClick={() =>data?.isLiked ? removeReaction({stackId:id}) : addReaction({stackId:id})}>
                        {data?.isLiked ? <Icon24Like/> : <Icon24LikeOutline />}
                    </div>
                </div>
                <Div>
                    <Subhead className="text-center text-secondary ">{data?.description}</Subhead>
                </Div>
                <Div>
                    <ButtonGroup stretched>
                        <Button mode="primary" stretched size="l">
                            Играть
                        </Button>
                        <Button mode="secondary" stretched size="l" before={<Icon24Add />}>
                            Дублировать
                        </Button>
                    </ButtonGroup>
                </Div>
                <Header
                    mode="primary"
                    aside={
                        <IconButton className="text-accent">
                            <Icon24Add />
                        </IconButton>
                    }
                >
                    Переводы
                </Header>
                <Div className="grid grid-cols-cards gap-3">
                    {data?.translations.map(({ translation }) => (
                        <FeedTranslationCard
                            foreign={translation.foreign}
                            vernacular={translation.vernacular}
                        />
                    ))}
                </Div>
            </div>

            {/* {data?.description && <Div>{data?.description}</Div>}

            <Div>
                {data?.translations.map(({ translation }) => (
                    <Fragment key={translation.id}>
                        <TranslationCard
                            id={translation.id}
                            key={translation.id}
                            vernacular={translation.vernacular}
                            foreign={translation.foreign}
                        />
                        <CellButton
                            onClick={() =>
                                deleteTranslationFromStack({
                                    translationId: translation.id,
                                    stackId: id,
                                })
                            }
                            mode={"danger"}
                            children={"Убрать перевод из стопки"}
                        />
                    </Fragment>
                ))}
            </Div> */}
        </>
    )
}
