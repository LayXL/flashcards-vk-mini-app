import baseTheme from "@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme"
import styled from "styled-components"

type LetterCellProps = {
    letter: string
}

export const LetterCell = ({ letter }: LetterCellProps) => {
    return (
        <Wrapper>
            <span>{letter}</span>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    font-size: 20px;
    background-color: ${baseTheme.colorBackgroundSecondary.normal.value};
`
