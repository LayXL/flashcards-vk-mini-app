import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { PanelHeader, PanelHeaderBack, Div } from "@vkontakte/vkui"
import { LetterCell } from "../features/wordly/ui/letter-cell"
import styled from "styled-components"

export const WordlyPanel = () => {
    const routeNavigator = useRouteNavigator()

    return (
        <>
            <PanelHeader
                before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
                children={"Wordly"}
            />

            <Div>
                <Rows>
                    <Row>
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                    </Row>
                    <Row>
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                    </Row>
                    <Row>
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                    </Row>
                    <Row>
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                    </Row>
                    <Row>
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                        <LetterCell letter={"А"} />
                    </Row>
                </Rows>
            </Div>
        </>
    )
}

const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: center;
`

const Rows = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`
