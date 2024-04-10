import { Button, Div, FormItem, Input } from "@vkontakte/vkui"
import { useState } from "react"
import { trpc } from "../shared/api"

type DuplicateStackProps = {
    stackId: number
    onSuccess?: () => void
}

export const DuplicateStack = ({ stackId, onSuccess }: DuplicateStackProps) => {
    const utils = trpc.useUtils()
    const { mutate, isError } = trpc.stacks.duplicate.useMutation({
        onSuccess: () => {
            onSuccess?.()
            utils.stacks.getUserStacks.invalidate()
        },
    })
    const { data } = trpc.stacks.getSingle.useQuery({ id: stackId })
    const [name, setName] = useState("")

    return (
        <>
            <FormItem top={"Название стопки"} status={isError ? "error" : "default"}>
                <Input
                    placeholder={data?.name}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                />
            </FormItem>
            <Div>
                <Button
                    stretched
                    size={"l"}
                    children={"Дублировать"}
                    onClick={() =>
                        mutate({
                            stackId,
                            name: name.length >= 3 ? name : undefined,
                        })
                    }
                />
            </Div>
        </>
    )
}
