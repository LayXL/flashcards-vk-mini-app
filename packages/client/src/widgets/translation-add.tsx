import { FloatingPortal } from "@floating-ui/react"
import { Icon28AddOutline, Icon28ErrorOutline } from "@vkontakte/icons"
import {
    Banner,
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
    Snackbar,
    Spacing,
    Switch,
    Textarea,
} from "@vkontakte/vkui"
import { useState } from "react"
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { StackSelect } from "./stack-select"

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
    isPrivate?: boolean
    saveToStackId?: number
}

type TranslationAddProps = {
    defaultValues?: Partial<TranslationFormInputs>
    onClose?: () => void
    onAdd?: (id: number) => void
}

export const TranslationAdd = ({ defaultValues, onClose, onAdd }: TranslationAddProps) => {
    const additionalInfoModal = useModalState()
    const selectStackModal = useModalState()
    const inappropriateSnackbar = useModalState()

    const utils = trpc.useUtils()

    const { control, handleSubmit, watch } = useForm<TranslationFormInputs>({
        defaultValues,
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "transcriptions",
    })

    const { data: stackData } = trpc.stacks.getSingle.useQuery(
        {
            id: watch("saveToStackId") ?? 0,
        },
        {
            enabled: !!watch("saveToStackId"),
        }
    )

    const { data: languageVariations } = trpc.languages.getLanguageVariations.useQuery({
        languageId: 1,
    })

    const [vernacular] = useDebounceValue(watch("vernacular"), 600)
    const [foreign] = useDebounceValue(watch("foreign"), 600)

    const { mutate: addTranslation, isPending: isAddingTranslation } =
        trpc.translations.add.useMutation({
            onSuccess: ({ id }) => {
                onAdd?.(id)

                selectStackModal.close()
                additionalInfoModal.close()

                utils.translations.getUserTranslations.refetch()
            },
            onError: (error) => {
                if (error.message.includes("Inappropriate")) inappropriateSnackbar.open()
            },
        })

    const { mutate: editTranslation, isPending: isEditingTranslation } =
        trpc.translations.edit.useMutation({
            onSuccess: () => {
                onClose?.()

                selectStackModal.close()
                additionalInfoModal.close()

                utils.translations.getUserTranslations.refetch()

                if (defaultValues?.id) {
                    utils.translations.getSingle.refetch({ id: defaultValues.id })
                }
            },
            onError: (error) => {
                if (error.message.includes("Inappropriate")) inappropriateSnackbar.open()
            },
        })

    const { data: duplications } = trpc.translations.findDuplications.useQuery(
        {
            foreign,
            vernacular,
            id: watch("id"),
        },
        {
            enabled: foreign?.length > 0 && vernacular?.length > 0,
        }
    )

    const isLoading = isAddingTranslation || isEditingTranslation

    const [newTag, setNewTag] = useState("")

    const onSubmit: SubmitHandler<TranslationFormInputs> = (data) => {
        if (defaultValues?.id) {
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
                isPrivate: data.isPrivate,
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
                isPrivate: data.isPrivate,
                stackId: data.saveToStackId ?? undefined,
            })
        }
    }

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderClose onClick={onClose} />}
                children={defaultValues?.id ? "Изменить перевод" : "Добавить перевод"}
            />

            {duplications && (duplications?.length ?? 0) > 0 && (
                <Div>
                    <Banner
                        header={"Похожий перевод уже есть в Лёрнинг"}
                        subheader={"Используйте уже существующий перевод"}
                        actions={
                            <TranslationCard
                                id={duplications[0].id}
                                vernacular={duplications[0].vernacular}
                                foreign={duplications[0].foreign}
                            />
                        }
                    />
                </Div>
            )}

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
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={"Профессия"}
                            />
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
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={"Profession"}
                            />
                        </FormItem>
                    )}
                />

                <Controller
                    control={control}
                    name={"languageVariationId"}
                    rules={{
                        required: false,
                    }}
                    render={({ field }) => (
                        <FormItem
                            top={"Разновидность языка"}
                            bottom={
                                "Укажите в том случае, если слово отличается по написанию в британском и американском английском"
                            }
                        >
                            <Select
                                placeholder={"Не обязательно"}
                                options={[
                                    ...(languageVariations?.map((variation) => ({
                                        label: variation.name,
                                        value: variation.id,
                                    })) ?? []),
                                ]}
                                value={field.value?.toString()}
                                onChange={({ currentTarget: { value } }) => {
                                    field.onChange(value.length > 0 ? parseInt(value) : undefined)
                                }}
                                allowClearButton={true}
                            />
                        </FormItem>
                    )}
                />

                <Controller
                    control={control}
                    name={"isPrivate"}
                    rules={{
                        required: false,
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <SimpleCell
                                children={"Скрыть перевод"}
                                subtitle={"Видеть cможете только вы"}
                                Component={"label"}
                                after={
                                    <Switch
                                        checked={!!field.value}
                                        onChange={() => field.onChange(!field.value)}
                                    />
                                }
                            />
                        </FormItem>
                    )}
                />
            </Group>

            <Group>
                {defaultValues?.id && (
                    <SimpleCell
                        expandable={"always"}
                        children={"Дополнительно"}
                        onClick={additionalInfoModal.open}
                    />
                )}

                {!defaultValues?.id && (
                    <>
                        <Header children={"Сохранить"} mode={"secondary"} />
                        <SimpleCell
                            expandable={"always"}
                            children={"Стопка"}
                            onClick={selectStackModal.open}
                            indicator={stackData?.name}
                        />
                    </>
                )}

                <Div>
                    <Button
                        loading={isLoading}
                        stretched={true}
                        size={"l"}
                        children={defaultValues?.id ? "Изменить" : "Продолжить"}
                        onClick={
                            defaultValues?.id ? handleSubmit(onSubmit) : additionalInfoModal.open
                        }
                    />
                </Div>
            </Group>

            <ModalWrapper isOpened={selectStackModal.isOpened} onClose={selectStackModal.close}>
                <ModalBody fullscreen>
                    <Controller
                        control={control}
                        name={"saveToStackId"}
                        render={({ field }) => (
                            <StackSelect
                                onClose={selectStackModal.close}
                                canCreateNewStack={true}
                                filter={"created"}
                                clearable={field.value !== undefined}
                                onClear={() => {
                                    field.onChange(undefined)
                                    selectStackModal.close()
                                }}
                                onSelect={(id) => {
                                    field.onChange(id)
                                    selectStackModal.close()
                                }}
                            />
                        )}
                    />
                </ModalBody>
            </ModalWrapper>

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
                                    <FormItem top={"Разновидность языка"}>
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
                                            allowClearButton={true}
                                            onChange={({ currentTarget: { value } }) =>
                                                field.onChange(
                                                    value.length > 0 ? parseInt(value) : null
                                                )
                                            }
                                        />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={control}
                                name={`transcriptions.${i}.transcription`}
                                render={({ field }) => (
                                    <FormItem
                                        top={"Транскрипция"}
                                        removable={true}
                                        onRemove={() => {
                                            remove(i)
                                        }}
                                    >
                                        <Input
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    </FormItem>
                                )}
                            />
                        </Group>
                    ))}

                    <CellButton
                        before={<Icon28AddOutline />}
                        children={"Добавить транскрипцию"}
                        onClick={() => append({ transcription: null })}
                    />

                    <Spacing size={128} />

                    <FloatingPortal>
                        <div className={"fixed bg-vk-content pb-safe-area-bottom w-full bottom-0"}>
                            <Div className={"pb-2"}>
                                <Button
                                    loading={isLoading}
                                    stretched={true}
                                    size={"l"}
                                    children={"Готово"}
                                    onClick={handleSubmit(onSubmit)}
                                />
                            </Div>
                        </div>
                    </FloatingPortal>
                </ModalBody>
            </ModalWrapper>

            <FloatingPortal>
                {inappropriateSnackbar.isOpened && (
                    <Snackbar
                        before={<Icon28ErrorOutline />}
                        children={"Вы используете недопустимые слова в переводе"}
                        onClose={inappropriateSnackbar.close}
                    />
                )}
            </FloatingPortal>
        </>
    )
}
