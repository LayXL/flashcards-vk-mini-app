import { Button, Card, Title } from "@vkontakte/vkui"
import styled from "styled-components"

type GameCardProps = {
    title: string
    choices: string[]
    onSelect: (choice: number) => void
}

export const GameCard = ({ title, choices, onSelect }: GameCardProps) => {
    return (
        <StyledCard>
            <TitleWrapper>
                <Title children={title} />
            </TitleWrapper>

            <Buttons>
                {choices.map((choice, i) => (
                    <Button
                        key={i}
                        stretched={true}
                        size={"l"}
                        children={choice}
                        onClick={() => onSelect(i)}
                    />
                ))}
            </Buttons>
        </StyledCard>
    )
}

const StyledCard = styled(Card)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    aspect-ratio: 1;
    user-select: none;
`

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
`

const Buttons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`
