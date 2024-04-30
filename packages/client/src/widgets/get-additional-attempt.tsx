import { Icon56LikeLockOutline } from "@vkontakte/icons"
import { Button, Div, ModalCardBase, Spacing } from "@vkontakte/vkui"
import { useModal } from "../features/modal/contexts/modal-context"
import { cn } from "../shared/helpers/cn"

type GetAdditionalAttemptProps = {
    isExtraEffort: boolean
    onClose: () => void
    onAction: () => void
}

export const GetAdditionalAttempt = ({
    isExtraEffort,
    onClose,
    onAction,
}: GetAdditionalAttemptProps) => {
    const modal = useModal()

    return (
        <Div>
            <ModalCardBase
                className={cn(
                    "animate-content-appearing",
                    !modal?.isOpenedAnimation && "animate-content-disappearing"
                )}
                onClose={onClose}
                header={"Попытки закончились"}
                subheader={
                    isExtraEffort
                        ? "Приходите завтра для новых попыток!"
                        : "Приходите завтра для новых попыток или посмотрите рекламу, чтобы получить дополнительный шанс!"
                }
                actions={
                    <>
                        <Spacing size={16} />
                        {!isExtraEffort ? (
                            <Button
                                size={"l"}
                                mode={"primary"}
                                stretched
                                onClick={onAction}
                                children={"Посмотреть рекламу"}
                            />
                        ) : (
                            <Button
                                size={"l"}
                                mode={"primary"}
                                stretched
                                onClick={onClose}
                                children={"Хорошо"}
                            />
                        )}
                    </>
                }
                icon={<Icon56LikeLockOutline />}
            />
        </Div>
    )
}
