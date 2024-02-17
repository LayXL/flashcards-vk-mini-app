import { Icon16Cards2, Icon28AddSquareOutline } from "@vkontakte/icons"
import { Caption, Subhead } from "@vkontakte/vkui"
import styled from "styled-components"
import { vkTheme } from "../../../shared/helpers/vkTheme"

type SearchStackCardProps = {
    name: string
    cardsCount: number
}

export const SearchStackCard = ({ name }: SearchStackCardProps) => {
    return (
        <Wrapper>
            <div
                style={{
                    boxSizing: "border-box",
                    zIndex: -1,
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translate(-50%)",
                    width: "142px",
                    height: "64px",
                    background:
                        "linear-gradient(0deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 100%), #2688EB",
                    borderRadius: "4px",
                }}
            />
            <div
                style={{
                    boxSizing: "border-box",
                    zIndex: -1,
                    position: "absolute",
                    top: 4,
                    left: "50%",
                    transform: "translate(-50%)",
                    width: "148px",
                    height: "64px",
                    background:
                        "linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #3C96F0",
                    borderRadius: "4px",
                }}
            />
            <Card>
                <Subhead children={"Front Office"} weight="1" />
                <Secondary>
                    <CardsCount>
                        <Icon16Cards2 />
                        <Caption level="2" weight="3" children={"120"} />
                    </CardsCount>

                    <Icon28AddSquareOutline color={vkTheme.colorAccentBlue.normal.value} />
                </Secondary>
            </Card>
        </Wrapper>
    )
}

const Wrapper = styled.div`
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
    box-shadow:
        0px 2px 24px 0px rgba(0, 0, 0, 0.08),
        0px 0px 2px 0px rgba(0, 0, 0, 0.08);
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
