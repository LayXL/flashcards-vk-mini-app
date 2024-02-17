import { Button, Div, FormItem, Group, Input, PanelHeader, PanelHeaderClose } from "@vkontakte/vkui"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useModal } from "../features/modal/contexts/modal-context"
import { trpc } from "../shared/api"

type StackFormInputs = {
    name: string
    description: string
}

export const StackCreateModal = () => {
    const modal = useModal()
    const utils = trpc.useUtils()
    const { control, handleSubmit } = useForm<StackFormInputs>({})
    const { mutate: createStack } = trpc.stacks.create.useMutation({
        onSuccess: () => {
            modal?.onClose()
            utils.stacks.getUserStacks.refetch()
        },
    })

    const onSubmit: SubmitHandler<StackFormInputs> = (data) => {
        createStack({
            name: data.name,
            description: data.description?.length >= 3 ? data.description : undefined,
        })
    }

    return (
        <>
            <PanelHeader
                before={<PanelHeaderClose onClick={() => modal?.onClose()} />}
                children={"Создать стопку"}
            />
            <Group>
                <Controller
                    control={control}
                    name={"name"}
                    rules={{
                        required: true,
                        minLength: 3,
                        maxLength: 96,
                    }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top={"Название стопки"}
                            status={fieldState.error ? "error" : "default"}
                        >
                            <Input value={field.value} onChange={field.onChange} />
                        </FormItem>
                    )}
                />

                <Controller
                    control={control}
                    name={"description"}
                    rules={{
                        required: false,
                        minLength: 3,
                        maxLength: 256,
                    }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top={"Описание стопки"}
                            status={fieldState.error ? "error" : "default"}
                        >
                            <Input value={field.value} onChange={field.onChange} />
                        </FormItem>
                    )}
                />
            </Group>
            <Div>
                <Button
                    stretched={true}
                    size={"l"}
                    children={"Добавить"}
                    onClick={handleSubmit(onSubmit)}
                />
            </Div>
        </>
    )
}
