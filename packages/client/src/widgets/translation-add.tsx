import { Icon28Delete } from "@vkontakte/icons"
import {
    Button,
    CellButton,
    ChipsInput,
    Div,
    FormItem,
    Group,
    Input,
    ModalPageHeader,
    PanelHeaderBack,
    PanelHeaderClose,
    SimpleCell,
    Textarea,
} from "@vkontakte/vkui"
import { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
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
        id: number
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

    const { control, handleSubmit } = useForm<TranslationFormInputs>({})

    const [newTag, setNewTag] = useState("")

    const onSubmit: SubmitHandler<TranslationFormInputs> = (data) => {
        console.log(data)
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

                <SimpleCell
                    expandable={"always"}
                    children={"Дополнительно"}
                    onClick={additionalInfoModal.open}
                />
            </Group>

            <Group>
                <Group>
                    <CellButton
                        before={<Icon28Delete />}
                        onClick={() => {}}
                        mode={"danger"}
                        children={"Удалить перевод"}
                    />

                    <Div>
                        <Button
                            stretched={true}
                            size={"l"}
                            children={defaultValues ? "Изменить" : "Добавить"}
                            onClick={handleSubmit(onSubmit)}
                        />
                    </Div>
                </Group>
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
                                <FormItem top={"Пример использования"}>
                                    <Textarea value={field.value} onChange={field.onChange} />
                                </FormItem>
                            )}
                        />

                        <Controller
                            control={control}
                            name={"foreignDescription"}
                            render={({ field, fieldState }) => (
                                <FormItem top={"Описание на языке перевода"}>
                                    <Textarea value={field.value} onChange={field.onChange} />
                                </FormItem>
                            )}
                        />

                        <Controller
                            control={control}
                            name={"tags"}
                            render={({ field, fieldState }) => (
                                <FormItem top={"Метки"}>
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
                                            field.onChange(
                                                tags.map(({ label }, i) => ({ label, value: i })),
                                            )
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                    </Group>
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
