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
    Select,
} from "@vkontakte/vkui"
import { Icon28DeleteOutline } from "@vkontakte/icons"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { useRecoilState } from "recoil"
import { newTranslation } from "../shared/store"
import { useState } from "react"

export const TranslationAddMoreInfo = () => {
    const modalsHistory = useModalHistory()
    const [translationData, setTranslationData] = useRecoilState(newTranslation)

    const [newTag, setNewTag] = useState("")

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={() => modalsHistory.openPreviousModal()} />}
                children={"Дополнительно"}
            />

            <Group>
                <FormItem top={"Пример использования"}>
                    <Input
                        value={translationData.example ?? ""}
                        onChange={({ currentTarget: { value } }) => {
                            setTranslationData((prev) => ({ ...prev, example: value }))
                        }}
                    />
                </FormItem>

                <FormItem top={"Метки"}>
                    <ChipsInput
                        inputValue={newTag}
                        value={translationData.tags.map((tag) => ({
                            label: tag,
                            value: tag,
                        }))}
                        addOnBlur
                        onInputChange={({ currentTarget: { value } }) => {
                            if (value.includes(" ")) {
                                setNewTag("")

                                setTranslationData((prev) => ({
                                    ...prev,
                                    tags: [...prev.tags, value.trim()],
                                }))
                            } else {
                                setNewTag(value)
                            }
                        }}
                        onChange={(tags) => {
                            setTranslationData((prev) => ({
                                ...prev,
                                tags: tags.map(({ label }) => label),
                            }))
                        }}
                    />
                </FormItem>
            </Group>

            {translationData.transcriptions.length > 0 &&
                translationData.transcriptions.map((x) => (
                    <TranscriptionGroup
                        key={x.id}
                        languageVariationId={x.languageVariationId}
                        transcription={x.transcription}
                        onUpdate={(data) => {
                            setTranslationData((prev) => {
                                const newTranscriptions = [...prev.transcriptions]

                                newTranscriptions[
                                    newTranscriptions.findIndex((y) => y.id === x.id)
                                ] = { id: x.id, ...data }

                                return {
                                    ...prev,
                                    transcriptions: newTranscriptions,
                                }
                            })
                        }}
                        canDelete={translationData.transcriptions.length > 1}
                        onDelete={() => {
                            setTranslationData((prev) => {
                                const newTranscriptions = prev.transcriptions.filter(
                                    (cur) => x.id !== cur.id,
                                )

                                return {
                                    ...prev,
                                    transcriptions:
                                        newTranscriptions.length === 0
                                            ? [
                                                  {
                                                      id: 0,
                                                      transcription: null,
                                                      languageVariationId: null,
                                                  },
                                              ]
                                            : newTranscriptions,
                                }
                            })
                        }}
                    />
                ))}

            <Group>
                <Div>
                    <Button
                        stretched
                        size="l"
                        children={"Добавить ещё транскрипцию"}
                        onClick={() => {
                            setTranslationData(({ transcriptions, ...prev }) => {
                                return {
                                    ...prev,
                                    transcriptions: [
                                        ...transcriptions,
                                        {
                                            id: transcriptions[transcriptions.length - 1].id + 1,
                                            transcription: null,
                                            languageVariationId: null,
                                        },
                                    ],
                                }
                            })
                        }}
                    />
                </Div>
            </Group>
        </>
    )
}

const TranscriptionGroup = ({
    transcription: originalTranscription,
    languageVariationId: originalLanguageVariationId,
    canDelete,
    onUpdate,
    onDelete,
}: {
    transcription?: string | null
    languageVariationId?: number | null
    canDelete: boolean
    onUpdate: (obj: { languageVariationId: number | null; transcription: string | null }) => void
    onDelete: () => void
}) => {
    const [languageVariationId, setLanguageVariationId] = useState<number | null>(
        originalLanguageVariationId ?? null,
    )
    const [transcription, setTranscription] = useState<string | null>(originalTranscription ?? null)

    return (
        <Group header={<Header children={"Транскрипция"} />}>
            <FormItem top={"Вариант перевода"}>
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
                    value={languageVariationId?.toString()}
                    onChange={(e) => {
                        setLanguageVariationId(parseInt(e.target.value))
                        onUpdate({
                            languageVariationId: parseInt(e.target.value),
                            transcription,
                        })
                    }}
                />
            </FormItem>

            <FormItem top={"Транскрипция"}>
                <Input
                    value={transcription?.toString() ?? ""}
                    onChange={(e) => {
                        setTranscription(e.target.value)
                        onUpdate({
                            languageVariationId,
                            transcription: e.target.value,
                        })
                    }}
                />
            </FormItem>
            {canDelete && (
                <CellButton
                    mode={"danger"}
                    before={<Icon28DeleteOutline />}
                    children={"Удалить транскрипцию"}
                    onClick={onDelete}
                />
            )}
        </Group>
    )
}
