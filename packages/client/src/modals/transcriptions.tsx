import {
    Button,
    CellButton,
    Div,
    FormItem,
    Group,
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
        <Group>
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

            <FormItem top={"Вариант перевода"}>
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

export const Transcriptions = () => {
    const modalsHistory = useModalHistory()
    const [translationData, setTranslationData] = useRecoilState(newTranslation)

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={() => modalsHistory.openPreviousModal()} />}
                children={"Транскрипции"}
            />

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
                        children={"Добавить ещё"}
                        onClick={() => {
                            setTranslationData((prev) => {
                                return {
                                    ...prev,
                                    transcriptions: [
                                        ...prev.transcriptions,
                                        {
                                            id: prev.transcriptions.length,
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
