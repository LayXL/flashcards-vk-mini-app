import {
    Button,
    ChipsInput,
    Div,
    FormItem,
    Group,
    Input,
    ModalPageHeader,
    PanelHeaderClose,
    Select,
    SimpleCell,
} from "@vkontakte/vkui"
import { useModalHistory } from "../shared/hooks/useModalHistory"
import { useRecoilState } from "recoil"
import { newTranslation } from "../shared/store"
import { useState } from "react"

export const TranslationAdd = () => {
    const modalsHistory = useModalHistory()

    const [translationData, setTranslationData] = useRecoilState(newTranslation)

    const [newTag, setNewTag] = useState("")

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderClose onClick={() => modalsHistory.close()} />}
                children={"Добавить перевод"}
            />

            <Group>
                {/* <FormItem top={"Язык перевода"}>
                    <Select
                        value={translationData.languageId}
                        placeholder={"Не выбран"}
                        options={[
                            {
                                label: "Английский",
                                value: 1,
                            },
                        ]}
                        onChange={({ currentTarget: { value } }) => {
                            setTranslationData((prev) => ({ ...prev, languageId: parseInt(value) }))
                        }}
                    />
                </FormItem> */}

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
                    children={"Транскрипции"}
                    onClick={() => modalsHistory.openModal("transcriptions")}
                />

                <FormItem top={"Метки"}>
                    <ChipsInput
                        inputValue=""
                        onInputChange={(e) => {
                            e.currentTarget.value
                        }}
                    />
                </FormItem>
            </Group>

            <Group>
                <Div>
                    <Button stretched size="l" children={"Добавить"} />
                </Div>
            </Group>
        </>
    )
}
