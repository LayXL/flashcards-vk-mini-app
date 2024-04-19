import {
    Icon24Add,
    Icon28DeleteOutline,
    Icon28EditOutline,
    Icon28HideOutline,
    Icon28LikeFillRed,
    Icon28LikeOutline,
    Icon28MoreHorizontal,
    Icon28ReportOutline,
} from "@vkontakte/icons"
import { Button, Caption, CellButton, Popover, Tappable, Text, Title } from "@vkontakte/vkui"
import styled from "styled-components"
import { cn } from "../../../shared/helpers/cn"
import { vkTheme } from "../../../shared/helpers/vkTheme"
import { FlagIcon } from "../../flag/ui/flag-icon"

type DetailedTranslationCardProps = {
    id?: number
    vernacular?: string
    foreign?: string
    languageVariationIcon?: string
    transcriptions?: {
        icon?: string
        transcription: string
    }[]
    tags?: string[]
    example?: string | null
    reactionsCount?: number
    onReactClick?: () => void
    onAddInStack?: () => void
    onEdit?: () => void
    onDelete?: () => void
    onReport?: () => void
    onHide?: () => void
    onShow?: () => void
    isReacted?: boolean
}

export const DetailedTranslationCard = ({
    vernacular,
    foreign,
    languageVariationIcon,
    transcriptions,
    tags,
    example,
    reactionsCount,
    onReactClick,
    isReacted: isLiked = false,
    onAddInStack,
    onReport,
    onEdit,
    onDelete,
    onHide,
    onShow,
}: DetailedTranslationCardProps) => (
    <Wrapper>
        <Primary>
            <Translation>
                <Header>
                    {languageVariationIcon && <FlagIcon flag={languageVariationIcon} />}
                    <Title style={{ flex: 1 }} children={foreign} />

                    <Popover
                        trigger={"click"}
                        placement={"bottom"}
                        content={({ onClose }) => (
                            <div
                                style={{
                                    backgroundColor: "var(--vkui--color_background_modal_inverse)",
                                    borderRadius: 8,
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                                }}
                            >
                                {onReport && (
                                    <CellButton
                                        role={"menuitem"}
                                        before={<Icon28ReportOutline />}
                                        onClick={() => {
                                            onReport()
                                            onClose()
                                        }}
                                        children={"Пожаловаться"}
                                    />
                                )}
                                {onEdit && (
                                    <CellButton
                                        role={"menuitem"}
                                        before={<Icon28EditOutline />}
                                        onClick={() => {
                                            onEdit()
                                            onClose()
                                        }}
                                        children={"Редактировать"}
                                    />
                                )}
                                {onDelete && (
                                    <CellButton
                                        role={"menuitem"}
                                        before={<Icon28DeleteOutline />}
                                        onClick={() => {
                                            onDelete()
                                            onClose()
                                        }}
                                        children={"Удалить"}
                                    />
                                )}
                                {onHide && (
                                    <CellButton
                                        role={"menuitem"}
                                        before={<Icon28HideOutline />}
                                        onClick={() => {
                                            onHide()
                                            onClose()
                                        }}
                                        children={"Скрыть из ленты"}
                                    />
                                )}
                                {onShow && (
                                    <CellButton
                                        role={"menuitem"}
                                        before={<Icon28HideOutline />}
                                        onClick={() => {
                                            onShow()
                                            onClose()
                                        }}
                                        children={"Показать в ленте"}
                                    />
                                )}
                            </div>
                        )}
                        children={
                            <Tappable
                                hoverMode={"opacity"}
                                activeMode={"opacity"}
                                children={<Icon28MoreHorizontal />}
                            />
                        }
                    />
                </Header>

                <Title level={"3"} weight={"1"} children={vernacular} />
            </Translation>

            {(transcriptions?.length ?? 0) > 0 && (
                <Transcriptions>
                    {transcriptions?.map((transcription, i) => (
                        <Transcription key={i}>
                            {transcription.icon && <FlagIcon flag={transcription.icon} />}
                            <Caption level={"2"} children={transcription.transcription} />
                        </Transcription>
                    ))}
                </Transcriptions>
            )}
            {(tags?.length ?? 0) > 0 && (
                <Tags>
                    {tags &&
                        tags?.map((tag, i) => (
                            <Tag key={i}>
                                <Caption level={"2"} children={"#" + tag} />
                            </Tag>
                        ))}
                </Tags>
            )}
        </Primary>
        <Secondary>
            {example && (
                <ExampleWrapper>
                    <Text weight={"2"} children={"Пример"} />
                    <Text weight={"3"} children={example} />
                </ExampleWrapper>
            )}
            <Actions>
                <Button
                    size={"l"}
                    before={<Icon24Add />}
                    children={"Добавить"}
                    onClick={onAddInStack}
                />
                <Tappable hoverMode={"opacity"} activeMode={"opacity"} onClick={onReactClick}>
                    <div
                        className={cn(
                            "flex flex-row items-center bg-secondary p-2 rounded-[10px] gap-[6px] cursor-pointer text-secondary",
                            isLiked && "bg-vk-accent text-white"
                        )}
                    >
                        {isLiked ? <Icon28LikeFillRed /> : <Icon28LikeOutline />}
                        {reactionsCount}
                    </div>
                </Tappable>
            </Actions>
        </Secondary>
    </Wrapper>
)

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
