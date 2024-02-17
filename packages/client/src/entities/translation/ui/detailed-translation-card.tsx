import {
    Icon16MoreHorizontal,
    Icon24Add,
    Icon28LikeFillRed,
    Icon28MoreHorizontal,
} from "@vkontakte/icons"
import { Caption, Title, Text, Tex, Button, IconButton, Div } from "@vkontakte/vkui"
import styled from "styled-components"

type DetailedTranslationCardProps = {
    id: number
    vernacular: string
    foreign: string
}

export const DetailedTranslationCard = ({}: DetailedTranslationCardProps) => {
    return (
        <>
            <Wrapper>
                <Primary>
                    <HeaderInformation>
                        <Flag />
                        <Title style={{ flex: 1 }} children="Availability" />
                        <Icon28MoreHorizontal />
                    </HeaderInformation>
                    <Title level="3" weight="1" children="Доступность" />
                    <Transcriptions>
                        <Transcription>
                            <Flag />
                            <Caption level="2" children="|əveɪləˈbɪlɪtɪ|" />
                        </Transcription>
                        <Transcription>
                            <Flag />
                            <Caption level="2" children="|əˌveɪləˈbɪlətɪ|" />
                        </Transcription>
                    </Transcriptions>
                    <Tags>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                        <Tag>
                            <Caption level="2" children="#туризм" />
                        </Tag>
                    </Tags>
                </Primary>
                <Secondary>
                    <ExampleWrapper>
                        <Text weight="2" children="Контекст" />
                        <Text
                            weight="3"
                            children="The fact that something is possible to get, buy, have or find"
                        />
                    </ExampleWrapper>
                    <AddButton>
                        <Button size="l" before={<Icon24Add />} children="Добавить" />
                        <IconButton children={<Icon28LikeFillRed />} />
                    </AddButton>
                </Secondary>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    border-radius: 16px;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.08), 0px 0px 2px 0px rgba(0, 0, 0, 0.08);
    overflow: hidden;
`

const Primary = styled.div`
    background: var(--Light-Button-Muted-Foreground, #2688eb);
    padding: 24px 20px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const Secondary = styled.div`
    background: var(--Light-Background-Content, #fff);
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const Flag = styled.div`
    background-color: #808080;
    height: 16px;
    width: 16px;
    border-radius: 2px;
`

const HeaderInformation = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`

const Transcriptions = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
`

const Transcription = styled.div`
    display: flex;
    flex-direction: row;
    gap: 6px;
    border-radius: 8px;
    background: var(--Light-Background-Content, #fff);
    color: #2c2d2e;
    padding: 8px;
`

const Tags = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    overflow: scroll;
    margin-right: -20px;
`
const Tag = styled.div`
    padding: 6px 8px;
    align-items: center;
    background: var(--Light-Background-Content, #fff);
    color: #2c2d2e;
    border-radius: 8px;
`
const AddButton = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
`

const ExampleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`