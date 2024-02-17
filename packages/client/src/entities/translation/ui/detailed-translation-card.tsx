import { Icon24Add, Icon28LikeFillRed, Icon28MoreHorizontal } from "@vkontakte/icons"
import { Button, Caption, IconButton, Text, Title } from "@vkontakte/vkui"
import styled from "styled-components"
import { vkTheme } from "../../../shared/helpers/vkTheme"
import { FlagIcon } from "../../flag/ui/flag-icon"

type DetailedTranslationCardProps = {
    id: number
    vernacular: string
    foreign: string
}

export const DetailedTranslationCard = ({ id }: DetailedTranslationCardProps) => {
    return (
        <>
            <Wrapper>
                <Primary>
                    <Translation>
                        <Header>
                            <FlagIcon flag="ame" />
                            <Title style={{ flex: 1 }} children="Availability" />
                            <Icon28MoreHorizontal />
                        </Header>

                        <Title level="3" weight="1" children="Доступность" />
                    </Translation>

                    <Transcriptions>
                        <Transcription>
                            <FlagIcon flag="bre" />
                            <Caption level="2" children="|əveɪləˈbɪlɪtɪ|" />
                        </Transcription>
                        <Transcription>
                            <FlagIcon flag="ame" />
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
                        <Text weight="2" children="Пример" />
                        <Text
                            weight="3"
                            children="The fact that something is possible to get, buy, have or find"
                        />
                    </ExampleWrapper>
                    <Actions>
                        <Button size="l" before={<Icon24Add />} children="Добавить" />
                        <IconButton children={<Icon28LikeFillRed />} />
                    </Actions>
                </Secondary>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    border-radius: 16px;
    box-shadow:
        0px 2px 24px 0px rgba(0, 0, 0, 0.08),
        0px 0px 2px 0px rgba(0, 0, 0, 0.08);
    overflow: hidden;
`

const Primary = styled.div`
    background: ${vkTheme.colorBackgroundAccent.normal.value};
    padding: 24px 20px 16px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const Secondary = styled.div`
    background: ${vkTheme.colorBackgroundModal.normal.value};
    padding: 20px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const Translation = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const Header = styled.div`
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
    margin: 0 -20px;
    padding: 0 20px;
`

const Tag = styled.div`
    padding: 6px 8px;
    align-items: center;
    background: var(--Light-Background-Content, #fff);
    color: #2c2d2e;
    border-radius: 8px;
`

const Actions = styled.div`
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
