import { Icon28AddOutline, Icon28Delete } from "@vkontakte/icons"
import {
    Button,
    CellButton,
    ChipsInput,
    Div,
    FormItem,
    Group,
    Header,
    Input,
    ModalPageHeader,
    PanelHeaderBack,
    PanelHeaderClose,
    Select,
    SimpleCell,
    Textarea,
} from "@vkontakte/vkui"
import { useState } from "react"
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"

type TranslationFormInputs = {
    id?: number
    languageId: number
    languageVariationId?: number
    vernacular: string
    foreign: string
    foreignDescription?: string
    example?: string
    tags?: string[]
    transcriptions?: {
        id?: number
        languageVariationId?: number | null
        transcription: string | null
    }[]
}

type TranslationAddProps = {
    defaultValues?: TranslationFormInputs
    onClose?: () => void
}

export const TranslationAdd = ({ defaultValues, onClose }: TranslationAddProps) => {
    const additionalInfoModal = useModalState()

    const utils = trpc.useUtils()

    // TODO remove hard-code
    const { data: languageVariations } = trpc.languages.getLanguageVariations.useQuery({
        languageId: 1,
    })

    const { control, handleSubmit } = useForm<TranslationFormInputs>({
        defaultValues,
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "transcriptions",
    })

    const { mutate: addTranslation, isPending: isAddingTranslation } =
        trpc.translations.add.useMutation({
            onSuccess: () => {
                onClose && onClose()
                utils.translations.getUserTranslations.refetch()

                if (defaultValues?.id) {
                    utils.translations.getSingle.refetch({ id: defaultValues.id })
                }
            },
        })

    const { mutate: editTranslation, isPending: isEditingTranslation } =
        trpc.translations.edit.useMutation({
            onSuccess: () => {
                onClose && onClose()
                utils.translations.getUserTranslations.refetch()

                if (defaultValues?.id) {
                    utils.translations.getSingle.refetch({ id: defaultValues.id })
                }
            },
        })

    const isLoading = isAddingTranslation || isEditingTranslation

    const [newTag, setNewTag] = useState("")

    const onSubmit: SubmitHandler<TranslationFormInputs> = (data) => {
        if (defaultValues) {
            if (!data.id) return

            editTranslation({
                id: data.id,
                ...data,
                languageId: 1,
                languageVariationId: data.languageVariationId
                    ? data.languageVariationId > 0
                        ? data.languageVariationId
                        : null
                    : undefined,
                transcriptions:
                    data.transcriptions
                        ?.filter((transcription) => transcription.transcription?.length !== 0)
                        .map((transcription) => ({
                            id: transcription.id,
                            transcription: transcription.transcription as string,
                            languageVariationId: transcription.languageVariationId ?? undefined,
                        })) ?? [],
                tags: data.tags ?? [],
            })
        } else {
            addTranslation({
                ...data,
                languageId: 1,
                languageVariationId: data.languageVariationId
                    ? data.languageVariationId > 0
                        ? data.languageVariationId
                        : undefined
                    : undefined,
                transcriptions:
                    data.transcriptions
                        ?.filter((transcription) => transcription.transcription?.length !== 0)
                        .map((transcription) => ({
                            transcription: transcription.transcription as string,
                            languageVariationId: transcription.languageVariationId ?? undefined,
                        })) ?? [],
                tags: data.tags ?? [],
            })
        }
    }

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderClose onClick={onClose} />}
                children={defaultValues ? "Изменить перевод" : "Добавить перевод"}
            />

            <Group>
                <Controller
                    control={control}
                    name={"vernacular"}
                    rules={{
                        required: true,
                        minLength: 3,
                        maxLength: 96,
                    }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top={"На родном языке"}
                            status={fieldState.error ? "error" : "default"}
                        >
                            <Input value={field.value} onChange={field.onChange} />
                        </FormItem>
                    )}
                />

                <Controller
                    control={control}
                    name={"foreign"}
                    rules={{
                        required: true,
                        minLength: 3,
                        maxLength: 96,
                    }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top={"На языке перевода"}
                            status={fieldState.error ? "error" : "default"}
                        >
                            <Input value={field.value} onChange={field.onChange} />
                        </FormItem>
                    )}
                />
            </Group>

            <Group>
                <Controller
                    control={control}
                    name={"languageVariationId"}
                    rules={{
                        required: false,
                    }}
                    render={({ field }) => (
                        <FormItem top={"Диалект"}>
                            <Select
                                placeholder={"Не обязательно"}
                                options={[
                                    {
                                        label: "Не выбрано",
                                        value: -1,
                                    },
                                    ...(languageVariations?.map((variation) => ({
                                        label: variation.name,
                                        value: variation.id,
                                    })) ?? []),
                                ]}
                                value={field.value?.toString()}
                                onChange={({ currentTarget: { value } }) =>
                                    field.onChange(parseInt(value))
                                }
                            />
                        </FormItem>
                    )}
                />

                <SimpleCell
                    expandable={"always"}
                    children={"Дополнительно"}
                    onClick={additionalInfoModal.open}
                />

                <Div>
                    <Button
                        loading={isLoading}
                        stretched={true}
                        size={"l"}
                        children={defaultValues ? "Изменить" : "Добавить"}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Div>
            </Group>

            <ModalWrapper
                isOpened={additionalInfoModal.isOpened}
                onClose={additionalInfoModal.close}
            >
                <ModalBody fullscreen>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={additionalInfoModal.close} />}
                        children={"Дополнительно"}
                    />

                    <Group>
                        <Controller
                            control={control}
                            name={"example"}
                            render={({ field, fieldState }) => (
                                <FormItem
                                    top={"Пример использования"}
                                    status={fieldState.error ? "error" : "default"}
                                >
                                    <Textarea value={field.value} onChange={field.onChange} />
                                </FormItem>
                            )}
                        />

                        <Controller
                            control={control}
                            name={"foreignDescription"}
                            render={({ field, fieldState }) => (
                                <FormItem
                                    top={"Описание на языке перевода"}
                                    status={fieldState.error ? "error" : "default"}
                                >
                                    <Textarea value={field.value} onChange={field.onChange} />
                                </FormItem>
                            )}
                        />

                        <Controller
                            control={control}
                            name={"tags"}
                            render={({ field, fieldState }) => (
                                <FormItem
                                    top={"Метки"}
                                    status={fieldState.error ? "error" : "default"}
                                >
                                    <ChipsInput
                                        inputValue={newTag}
                                        onInputChange={({ currentTarget: { value } }) => {
                                            if (value.includes(" ")) {
                                                setNewTag("")

                                                field.onChange([
                                                    ...(field.value ?? []),
                                                    value.trim(),
                                                ])
                                            } else {
                                                setNewTag(value)
                                            }
                                        }}
                                        addOnBlur={true}
                                        value={field.value?.map((tag, i) => ({
                                            label: tag,
                                            value: i,
                                        }))}
                                        onChange={(tags) => {
                                            field.onChange(tags.map(({ label }) => label))
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                    </Group>

                    {fields.map((field, i) => (
                        <Group key={field.id}>
                            <Header>Транскрипция</Header>
                            <Controller
                                control={control}
                                name={`transcriptions.${i}.languageVariationId`}
                                render={({ field }) => (
                                    <FormItem top={"Диалект"}>
                                        <Select
                                            placeholder={"Не обязательно"}
                                            options={[
                                                {
                                                    label: "Британский английский",
                                                    value: 1,
                                                },
                                                {
                                                    label: "Американский английский",
                                                    value: 2,
                                                },
                                            ]}
                                            value={field.value as unknown as string}
                                            onChange={({ currentTarget: { value } }) =>
                                                field.onChange(parseInt(value))
                                            }
                                        />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={control}
                                name={`transcriptions.${i}.transcription`}
                                render={({ field }) => (
                                    <FormItem top={"Транскрипция"}>
                                        <Input
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    </FormItem>
                                )}
                            />

                            <CellButton
                                mode={"danger"}
                                before={<Icon28Delete />}
                                children={"Удалить транскрипцию"}
                                onClick={() => remove(i)}
                            />
                        </Group>
                    ))}

                    <CellButton
                        before={<Icon28AddOutline />}
                        children={"Добавить транскрипцию"}
                        onClick={() => append({ transcription: null })}
                    />

                    <Div>
                        <Button
                            stretched={true}
                            size={"l"}
                            children={"Готово"}
                            onClick={additionalInfoModal.close}
                        />
                    </Div>
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
