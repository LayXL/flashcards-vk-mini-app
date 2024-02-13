import {
    Button,
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

export const TranslationAdd = () => {
    const modalsHistory = useModalHistory()

    const { mutate: addTranslation } = trpc.translations.add.useMutation()

    const [translationData, setTranslationData] = useRecoilState(newTranslation)

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderClose onClick={() => modalsHistory.close()} />}
                children={"Добавить перевод"}
            />

            <Group>
                <FormItem top={"На родном языке"}>
                    <Input
                        value={translationData.vernacular}
                        onChange={({ currentTarget: { value } }) => {
                            setTranslationData((prev) => ({ ...prev, vernacular: value }))
                        }}
                    />
                </FormItem>

                <FormItem top={"На языке перевода"}>
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
                    children={"Дополнительная информация"}
                    onClick={() => modalsHistory.openModal("translationAddMoreInfo")}
                />

                <Div>
                    <Button
                        stretched
                        size="l"
                        children={"Добавить"}
                        onClick={() => {
                            addTranslation({
                                languageId: translationData.languageId ?? 1,
                                languageVariationId:
                                    translationData.languageVariationId ?? undefined,
                                vernacular: translationData.vernacular,
                                foreign: translationData.vernacular,
                                tags: translationData.tags,
                                transcriptions: translationData.transcriptions
                                    .filter(({ transcription }) => transcription)
                                    .map(({ transcription, languageVariationId }) => ({
                                        languageVariationId: languageVariationId ?? undefined,
                                        transcription: transcription ?? "",
                                    })),
                            })
                        }}
                    />
                </Div>
            </Group>
        </>
    )
}
