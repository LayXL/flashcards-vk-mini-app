import { FloatingPortal } from "@floating-ui/react"
import { Icon16MoreHorizontal, Icon28AddSquareOutline, Icon28Delete } from "@vkontakte/icons"
import { ActionSheet, ActionSheetItem, Avatar, Caption, Subhead } from "@vkontakte/vkui"
import { useModalState } from "../../../shared/hooks/useModalState"

type FeedTranslationCardProps = {
    foreign: string
    vernacular: string
    authorName?: string | null
    authorAvatarUrl?: string
    onAdd: () => void
    onClick: () => void
    onRemoveFromStack?: () => void
    isWithMore?: boolean
}

export const FeedTranslationCard = ({
    foreign,
    vernacular,
    authorName,
    authorAvatarUrl,
    onAdd,
    onClick,
    isWithMore,
    onRemoveFromStack,
}: FeedTranslationCardProps) => {
    const showMoreModal = useModalState()

    return (
        <>
            <div
                className={
                    "press-scale flex flex-col gap-2 bg-secondary p-3 pr-[9px] rounded-xl cursor-pointer animate-fade-in"
                }
                onClick={onClick}
            >
                <div className={"flex justify-between"}>
                    <Subhead className={"line-clamp-1 break-all"} weight={"1"} children={foreign} />
                    {isWithMore && (
                        <Icon16MoreHorizontal
                            onClick={(e) => {
                                e.stopPropagation()
                                showMoreModal.open()
                            }}
                        />
                    )}
                </div>
                <div className={"flex"}>
                    <Caption
                        children={vernacular}
                        className={"text-subhead line-clamp-1 break-all"}
                    />
                </div>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2 items-center"}>
                        {authorAvatarUrl && <Avatar size={24} src={authorAvatarUrl} />}
                        {authorName && (
                            <Caption
                                children={authorName}
                                className={"text-subhead line-clamp-1"}
                            />
                        )}
                    </div>
                    <Icon28AddSquareOutline
                        onClick={(e) => {
                            e.stopPropagation()
                            onAdd && onAdd()
                        }}
                    />
                </div>
            </div>

            {showMoreModal.isOpened && (
                <FloatingPortal>
                    <ActionSheet onClose={showMoreModal.close} toggleRef={undefined}>
                        {onRemoveFromStack && (
                            <ActionSheetItem
                                onClick={() => {
                                    onRemoveFromStack()
                                }}
                                mode={"destructive"}
                                before={<Icon28Delete />}
                                children={"Удалить из стопки"}
                            />
                        )}
                    </ActionSheet>
                </FloatingPortal>
            )}
        </>
    )
}
