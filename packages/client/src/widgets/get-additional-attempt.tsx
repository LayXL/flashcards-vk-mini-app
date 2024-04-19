import { Icon56LikeLockOutline } from "@vkontakte/icons"
import { Button, Div, ModalCardBase, Spacing } from "@vkontakte/vkui"

type GetAdditionalAttemptProps = {
    onClose: () => void
    onAction: () => void
}

export const GetAdditionalAttempt = ({ onClose, onAction }: GetAdditionalAttemptProps) => {
    return (
        <Div>
            <ModalCardBase
                onClose={onClose}
                header={"Попытки закончились"}
                subheader={
                    "Приходите завтра для новых попыток или просмотрите рекламу, чтобы получить дополнительный шанс!"
                }
                actions={
                    <>
                        <Spacing size={16} />
                        <Button
                            size={"l"}
                            mode={"primary"}
                            stretched
                            onClick={onAction}
                            children={"Посмотреть рекламу"}
                        />
                    </>
                }
                icon={<Icon56LikeLockOutline />}
            />
        </Div>
    )
}
