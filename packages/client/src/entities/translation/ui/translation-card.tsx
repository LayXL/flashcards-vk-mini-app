import { FloatingPortal } from "@floating-ui/react"
import { Icon16MoreHorizontal, Icon20AddCircle, Icon28Delete } from "@vkontakte/icons"
import { ActionSheet, ActionSheetItem, Caption, Subhead } from "@vkontakte/vkui"
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
}: TranslationCardProps) => {
    const showMoreModal = useModalState()

    return (
        <>
            <div
                className={
                    "press-scale bg-secondary rounded-xl cursor-pointer animate-fade-in p-2 flex flex-col justify-between h-full box-border relative min-h-[106px]"
                }
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
                    <Subhead children={foreign} className={"font-semibold text-muted"} />
                    <Caption children={vernacular} level={"2"} className={"text-subhead"} />
                </div>
                <div className={"flex justify-between"}>
                    <div className={"flex-1"}>
                        {authorName && (
                            <AuthorCard authorName={authorName} authorAvatarUrl={authorAvatarUrl} />
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
