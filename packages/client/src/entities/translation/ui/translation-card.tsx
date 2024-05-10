import { FloatingPortal } from "@floating-ui/react"
import { Icon16MoreHorizontal, Icon20AddCircle, Icon28Delete } from "@vkontakte/icons"
import { ActionSheet, ActionSheetItem, Caption, Subhead } from "@vkontakte/vkui"
import { cn } from "../../../shared/helpers/cn"
import { useModalState } from "../../../shared/hooks/useModalState"
import { AuthorCard } from "../../../shared/ui/author-card"

type TranslationCardProps = {
    foreign: string
    vernacular: string
    authorName?: string | null
    authorAvatarUrl?: string
    onAdd: () => void
    onClick: () => void
    onRemoveFromStack?: () => void
    isWithMore?: boolean
    type?: "correct" | "incorrect" | "default"
}

export const TranslationCard = ({
    foreign,
    vernacular,
    authorName,
    authorAvatarUrl,
    onAdd,
    onClick,
    isWithMore,
    onRemoveFromStack,
    type = "default",
}: TranslationCardProps) => {
    const showMoreModal = useModalState()

    return (
        <>
            <div
                className={cn(
                    "press-scale bg-secondary rounded-xl cursor-pointer animate-fade-in p-2 flex flex-col justify-between h-full box-border relative min-h-[106px]",
                    type === "correct" && "border  border-solid border-dynamic-green",
                    type === "incorrect" && "border  border-solid border-dynamic-red"
                )}
                onClick={onClick}
            >
                {(isWithMore || onRemoveFromStack) && (
                    <Icon16MoreHorizontal
                        className={"absolute top-1 right-2 text-secondary"}
                        onClick={(e) => {
                            e.stopPropagation()
                            showMoreModal.open()
                        }}
                    />
                )}
                <div className={"pt-4 text-center"}>
                    <Subhead
                        children={foreign}
                        className={"font-semibold text-muted line-clamp-1"}
                    />
                    <Caption
                        children={vernacular}
                        level={"2"}
                        className={"text-subhead line-clamp-2"}
                    />
                </div>
                <div className={"flex justify-between"}>
                    <div className={"flex-1 flex"}>
                        {authorName && (
                            <AuthorCard authorName={authorName} authorAvatarUrl={authorAvatarUrl} />
                        )}
                        {type === "correct" && (
                            <div
                                className={
                                    "px-2 h-5 flex items-center bg-dynamic-green rounded-xl text-white"
                                }
                                children={
                                    <Caption caps level={"2"} weight={"1"} children={"Верно"} />
                                }
                            />
                        )}
                        {type === "incorrect" && (
                            <div
                                className={
                                    "px-2 h-5 flex items-center bg-dynamic-red rounded-xl text-white"
                                }
                                children={
                                    <Caption caps level={"2"} weight={"1"} children={"Неверно"} />
                                }
                            />
                        )}
                    </div>
                    <Icon20AddCircle
                        className={"text-accent"}
                        onClick={(e) => {
                            e.stopPropagation()
                            onAdd()
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
                                children={"Удалить из коллекции"}
                            />
                        )}
                    </ActionSheet>
                </FloatingPortal>
            )}
        </>
    )
}
