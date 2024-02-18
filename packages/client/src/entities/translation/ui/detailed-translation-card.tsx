import { Icon24Add, Icon28LikeFillRed, Icon28LikeOutline, Icon28MoreHorizontal } from "@vkontakte/icons"
import { Button, Caption, IconButton, Text, Title } from "@vkontakte/vkui"
import styled from "styled-components"
import { vkTheme } from "../../../shared/helpers/vkTheme"
import { FlagIcon } from "../../flag/ui/flag-icon"

type DetailedTranslationCardProps = {
    id: number
    vernacular: string
    foreign: string
    languageVariationIcon?: string,
    transcriptions: {
        icon: string,
        transcription: string
    }[],
    tags: string[]
    example: string
    onLike:() => void
    isLiked: boolean
    onAddInStack:()=> void
}

export const DetailedTranslationCard = ({
    id,
    vernacular,
    foreign,
    languageVariationIcon,
    transcriptions,
    tags,
    example,
    onLike,
    isLiked,
    onAddInStack,
}: DetailedTranslationCardProps) => {
    console.log(languageVariationIcon)
    return (
        <>
            <Wrapper>
                <Primary>
                    <Translation>
                        <Header>
                            {languageVariationIcon && <FlagIcon flag={languageVariationIcon}/>}
                            <Title style={{ flex: 1 }} children={foreign} />
                            <Icon28MoreHorizontal />
                        </Header>

                        <Title level="3" weight="1" children={vernacular} />
                    </Translation>

                    <Transcriptions>
                        {
                            transcriptions?.map((transcription)=>(
                                <Transcription>
                            <FlagIcon flag={transcription.icon} />
                            <Caption level="2" children={transcription.transcription} />
                        </Transcription>
                            ))
                        }
                    </Transcriptions>
                    <Tags>
                        {tags && tags?.map((tag)=>(
                            <Tag>
                            <Caption level="2" children={'#' + tag} />
                        </Tag>
                        ))}
                    </Tags>
                </Primary>
                <Secondary>
                    <ExampleWrapper>
                        <Text weight="2" children="Пример" />
                        <Text
                            weight="3"
                            children={example}
                        />
                    </ExampleWrapper>
                    <Actions>
                        <Button size="l" before={<Icon24Add />} children="Добавить" onClick={onAddInStack}/>
                        <IconButton onClick={onLike} children={isLiked?<Icon28LikeFillRed />:<Icon28LikeOutline />} />
                    </Actions>
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
