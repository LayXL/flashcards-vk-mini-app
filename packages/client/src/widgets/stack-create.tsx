import { Icon32CheckCircle } from "@vkontakte/icons"
import {
    Button,
    CardScroll,
    Div,
    FormItem,
    Group,
    Header,
    Input,
    ModalPageHeader,
    PanelHeaderClose,
} from "@vkontakte/vkui"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Pattern, StackBackground } from "../entities/stack/ui/stack-background"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"

type StackFormInputs = {
    name: string
    description: string
    pattern: string
    palette: number
}

type StackCreateModalProps = {
    id?: number
    onSuccess?: (id: number) => void
    onClose?: () => void
} & Partial<StackFormInputs>

export const StackCreateModal = ({
    id,
    onSuccess,
    onClose,
    ...defaultValues
}: StackCreateModalProps) => {
    const utils = trpc.useUtils()

    const { control, handleSubmit, watch } = useForm<StackFormInputs>({
        defaultValues,
    })

    const { mutate: createStack } = trpc.stacks.create.useMutation({
        onSuccess: ({ id }) => {
            onClose?.()
            utils.stacks.getUserStacks.refetch({})
            onSuccess?.(id)
        },
    })

    const { mutate: editStack } = trpc.stacks.edit.useMutation({
        onSuccess: () => {
            onClose?.()
            utils.stacks.getUserStacks.refetch({})

            id && utils.stacks.getSingle.refetch({ id })
        },
    })

    const { data: patterns } = trpc.stacks.customization.getPatterns.useQuery()
    const { data: palettes } = trpc.stacks.customization.getPalettes.useQuery()

    const onSubmit: SubmitHandler<StackFormInputs> = (data) => {
        if (id) {
            editStack({
                id,
                name: data.name,
                description: data.description?.length >= 3 ? data.description : null,
                pattern: data.pattern as Pattern,
                palette: data.palette,
            })
        } else {
            createStack({
                name: data.name,
                description: data.description?.length >= 3 ? data.description : undefined,
                pattern: data.pattern as Pattern,
                palette: data.palette,
            })
        }
    }

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderClose onClick={onClose} />}
                children={id ? "Редактировать стопку" : "Создать стопку"}
            />

            <Group>
                <Header children={"Внешний вид"} mode={"secondary"} />

                <Controller
                    control={control}
                    name={"pattern"}
                    render={({ field }) => (
                        <CardScroll>
                            <div className={"flex-row gap-2"}>
                                {patterns?.map((background) => (
                                    <div
                                        className={cn(
                                            "relative aspect-[4/5] h-[140px] bg-vk-secondary rounded-xl overflow-hidden cursor-pointer"
                                        )}
                                        key={background.name}
                                        onClick={() => {
                                            field.onChange(background.name)
                                        }}
                                    >
                                        {watch("pattern") == background.name && (
                                            <Icon32CheckCircle
                                                className={"absolute right-0.5 top-0.5"}
                                                fill={"white"}
                                            />
                                        )}
                                        <StackBackground
                                            pattern={background.name as Pattern}
                                            primaryColor={
                                                palettes?.find(({ id }) => watch("palette") == id)
                                                    ?.primary ?? "#0037EC"
                                            }
                                            secondaryColor={
                                                palettes?.find(({ id }) => watch("palette") == id)
                                                    ?.secondary ?? "#0077FF"
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardScroll>
                    )}
                />

                <Controller
                    control={control}
                    name={"palette"}
                    render={({ field }) => (
                        <CardScroll>
                            <div className={"flex-row gap-2"}>
                                {palettes?.map((color) => (
                                    <div
                                        className={cn(
                                            "h-[42px] w-[42px] rounded-full overflow-hidden box-border cursor-pointer",
                                            "border-solid border-transparent",
                                            watch("palette") == color.id && "border-white"
                                        )}
                                        onClick={() => field.onChange(color.id)}
                                    >
                                        <div
                                            className={"rotate-[135deg] w-full h-full"}
                                            key={color.id}
                                            style={{
                                                backgroundColor: color.primary,
                                            }}
                                        >
                                            <div
                                                className={"w-full h-1/2"}
                                                style={{
                                                    backgroundColor: color.secondary,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardScroll>
                    )}
                />
            </Group>
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
                    children={id ? "Изменить" : "Создать"}
                    onClick={handleSubmit(onSubmit)}
                />
            </Div>
        </>
    )
}
