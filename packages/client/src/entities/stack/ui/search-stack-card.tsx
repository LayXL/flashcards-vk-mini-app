import { Icon16Cards2, Icon28AddSquareOutline, Icon28CheckSquareOutline } from "@vkontakte/icons"
import { Caption, Subhead } from "@vkontakte/vkui"
import { useState } from "react"
import styled from "styled-components"
import { ModalBody } from "../../../features/modal/ui/modal-body"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { trpc } from "../../../shared/api"
import { vkTheme } from "../../../shared/helpers/vkTheme"
import { useModalState } from "../../../shared/hooks/useModalState"
import { StackView } from "../../../widgets/stack-view"

type SearchStackCardProps = {
    id: number
    name: string
    cardsCount: number
    isLiked?: boolean
}

export const SearchStackCard = ({ name, cardsCount, id, isLiked }: SearchStackCardProps) => {
    const viewStack = useModalState()

    const [isLikedState, setIsLikedState] = useState(isLiked)

    const { mutate: addReaction } = trpc.stacks.addReaction.useMutation({
        onMutate: () => setIsLikedState(true),
    })

    const { mutate: removeReaction } = trpc.stacks.removeReaction.useMutation({
        onMutate: () => setIsLikedState(false),
    })

    return (
        <>
            <Wrapper onClick={viewStack.open}>
                <div>
                    <div className={"bg-vk-secondary h-1 rounded-t-xl mx-3"} />
                    <div className={"bg-vk-secondary h-1 rounded-t-xl mx-1.5"} />
                </div>
                <Card>
                    <Subhead children={name} weight={"1"} />
                    <Secondary>
                        <CardsCount>
                            <Icon16Cards2 />
                            <Caption level={"2"} weight={"3"} children={cardsCount} />
                        </CardsCount>

                        {/* TODO */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                isLikedState
                                    ? removeReaction({ stackId: id })
                                    : addReaction({ stackId: id })
                            }}
                        >
                            {!isLikedState ? (
                                <Icon28AddSquareOutline
                                    color={vkTheme.colorAccentBlue.normal.value}
                                />
                            ) : (
                                <Icon28CheckSquareOutline
                                    color={vkTheme.colorAccentBlue.normal.value}
                                />
                            )}
                        </div>
                    </Secondary>
                </Card>
            </Wrapper>

            <ModalWrapper isOpened={viewStack.isOpened} onClose={viewStack.close}>
                <ModalBody fullscreen>
                    <StackView id={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}

const Wrapper = styled.div`
    cursor: pointer;
    position: relative;
    padding-top: 10px;
`

const Card = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 72px;
    padding: 12px 9px 12px 12px;
    border-radius: 8px;
    width: 160px;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.08), 0px 0px 2px 0px rgba(0, 0, 0, 0.08);
    background-color: ${vkTheme.colorBackgroundModal.normal.value};
`

const CardsCount = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const Secondary = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${vkTheme.colorTextSubhead.normal.value};
`
