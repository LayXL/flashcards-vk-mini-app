import { Icon24CheckCircleOn } from "@vkontakte/icons"
import { Button, Cell, Div, FormItem, Header, Textarea } from "@vkontakte/vkui"
import { useCallback, useState } from "react"
import { trpc } from "../shared/api"

type ReportCreateProps = {
    translationId: number
    onReport?: () => void
}

const reasons = [
    "Неподходящий контент",
    "Спам",
    "Ложная информация",
    "Разглашение личной информации",
    "Другое",
]

export const ReportCreate = ({ translationId, onReport }: ReportCreateProps) => {
    const [selectedReason, setSelectedReason] = useState<number | null>(null)
    const [note, setNote] = useState<string>("")

    const { mutate } = trpc.reports.reportTranslation.useMutation({
        onSuccess: () => {
            onReport?.()
        },
    })

    const reportTranslation = useCallback(() => {
        if (selectedReason === null) return

        mutate({
            translationId,
            reason: reasons[selectedReason],
            note,
        })
    }, [mutate, note, selectedReason, translationId])

    return (
        <>
            <Header mode={"secondary"} children={"Причина"} />
            {reasons.map((reason, i) => (
                <Cell
                    key={reason}
                    onClick={() => setSelectedReason(i)}
                    children={reason}
                    after={i === selectedReason && <Icon24CheckCircleOn />}
                />
            ))}
            <FormItem top={"Примечание"}>
                <Textarea
                    placeholder={"Расскройте суть вашей жалобы"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </FormItem>
            <Div>
                <Button
                    stretched
                    size={"l"}
                    children={"Отправить"}
                    onClick={reportTranslation}
                    disabled={selectedReason === null}
                />
            </Div>
        </>
    )
}
