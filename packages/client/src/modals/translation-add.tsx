import {
    Button,
    CellButton,
    Div,
    FormItem,
    Group,
    Input,
    ModalPageHeader,
    PanelHeaderClose,
    SimpleCell,
} from "@vkontakte/vkui"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { useRecoilState } from "recoil"
import { newTranslation } from "../shared/store"
import { trpc } from "../shared/api"
import { useCallback } from "react"

export const TranslationAdd = () => {
    const modalsHistory = useModalHistory()

    const utils = trpc.useUtils()

    const { mutate: addTranslation, isPending: isAddingTranslation } =
        trpc.translations.add.useMutation({
            onSuccess: () => {
                modalsHistory.close()
                utils.translations.getUserTranslations.refetch()
            },
        })

    const { mutate: editTranslation, isPending: isEditingTranslation } =
        trpc.translations.edit.useMutation({
            onSuccess: () => {
                modalsHistory.close()
                utils.translations.getUserTranslations.refetch()
            },
        })

    const [translationData, setTranslationData] = useRecoilState(newTranslation)

    const onSave = useCallback(() => {
        if (translationData.isEditing) {
            if (!translationData.translationId) return

            editTranslation({
                id: translationData.translationId,
                languageId: translationData.languageId ?? 1,
                languageVariationId: translationData.languageVariationId ?? undefined,
                vernacular: translationData.vernacular,
                foreign: translationData.foreign,
                foreignDescription:
                    (translationData.foreignDescription?.length ?? 0) > 0
                        ? translationData.foreignDescription ?? undefined
                        : undefined,
                example:
                    (translationData.example?.length ?? 0) > 0
                        ? translationData.example ?? undefined
                        : undefined,
                tags: translationData.tags,
            })
        } else {
            addTranslation({
                languageId: translationData.languageId ?? 1,
                languageVariationId: translationData.languageVariationId ?? undefined,
                vernacular: translationData.vernacular,
                foreign: translationData.foreign,
                example:
                    (translationData.example?.length ?? 0) > 0
                        ? translationData.example ?? undefined
                        : undefined,
                tags: translationData.tags,
                foreignDescription:
                    (translationData.foreignDescription?.length ?? 0) > 0
                        ? translationData.foreignDescription ?? undefined
                        : undefined,
                transcriptions: translationData.transcriptions
                    .filter(({ transcription }) => transcription)
                    .map(({ transcription, languageVariationId }) => ({
                        languageVariationId: languageVariationId ?? undefined,
                        transcription: transcription ?? "",
                    })),
            })
        }
    }, [addTranslation, editTranslation, translationData])

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderClose onClick={() => modalsHistory.close()} />}
                children={translationData.isEditing ? "Изменить перевод" : "Добавить перевод"}
            />

            <Group>
                {translationData.isEditing && (
                    <FormItem top={"Язык перевода"}>
                        <Input />
                    </FormItem>
                )}

                <FormItem top={"На родном языке"}>
                    <Input
                        value={translationData.vernacular}
                        onChange={({ currentTarget: { value } }) => {
                            setTranslationData((prev) => ({ ...prev, vernacular: value }))
                        }}
                    />
                </FormItem>

                <FormItem
                    top={"На языке перевода"}
                    bottom={!translationData.isEditing && "Язык можно сменить в настройках"}
                >
                    <Input
                        value={translationData.foreign}
                        onChange={({ currentTarget: { value } }) => {
                            setTranslationData((prev) => ({ ...prev, foreign: value }))
                        }}
                    />
                </FormItem>
            </Group>

            <Group>
                <SimpleCell
                    expandable={"always"}
                    children={"Дополнительно"}
                    onClick={() => modalsHistory.openModal("translationAddMoreInfo")}
                />

                {translationData.isEditing && (
                    <CellButton onClick={() => {}} mode={"danger"} children={"Удалить перевод"} />
                )}

                <Div>
                    <Button
                        loading={isAddingTranslation || isEditingTranslation}
                        stretched={true}
                        size={"l"}
                        children={translationData.isEditing ? "Изменить" : "Добавить"}
                        onClick={onSave}
                    />
                </Div>
            </Group>
        </>
    )
}
