import { Icon56ReportOutline } from "@vkontakte/icons"
import {
    Button,
    ButtonGroup,
    Caption,
    Div,
    Placeholder,
    SubnavigationBar,
    SubnavigationButton,
    Text,
    Title,
} from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useState } from "react"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { RouterInput, trpc } from "../shared/api"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import useInfiniteList from "../shared/hooks/useInfiniteList"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationView } from "./translation-view"

export const ReportsView = () => {
    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)
    const [filter, setFilter] = useState<RouterInput["reports"]["getMany"]["filter"]>("opened")

    const translationView = useModalState()

    const utils = trpc.useUtils()

    const { data, isSuccess } = trpc.reports.getMany.useInfiniteQuery(
        { filter, limit: 10 },
        {
            getNextPageParam: (lastPage) => lastPage.cursor,
        }
    )

    const { mutate: changeStatus } = trpc.reports.changeStatus.useMutation({
        onSuccess: () => {
            utils.reports.getMany.invalidate()
        },
    })

    const items = useInfiniteList(data)

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    selected={filter === "opened"}
                    children={"Открытые"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "opened" ? "all" : "opened")
                    }}
                />
                <SubnavigationButton
                    selected={filter === "resolved"}
                    children={"Решённые"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "resolved" ? "all" : "resolved")
                    }}
                />
                <SubnavigationButton
                    selected={filter === "cancelled"}
                    children={"Ошибочные"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "cancelled" ? "all" : "cancelled")
                    }}
                />
            </SubnavigationBar>

            <Div className={"flex flex-col gap-3"}>
                {items?.map((item) => (
                    <div
                        className={
                            "bg-vk-secondary rounded-xl p-3 cursor-pointer flex flex-col gap-2"
                        }
                        onClick={() => {
                            setSelectedTranslation(item.translationId)
                            translationView.open()
                        }}
                    >
                        <div className={"flex gap-1.5 justify-between"}>
                            <Title
                                level={"2"}
                                className={"line-clamp-1"}
                                children={item.translation?.foreign}
                            />
                            <Title
                                level={"2"}
                                className={"line-clamp-1"}
                                children={item.translation?.vernacular}
                            />
                        </div>
                        <Text children={item.reason} />
                        {item.note && <Text children={item.note} />}
                        <Caption
                            children={DateTime.fromISO(item.reportedAt).toFormat("DDD")}
                            className={"opacity-60"}
                        />
                        <ButtonGroup mode={"horizontal"} stretched>
                            <Button
                                stretched
                                children={"Ошибочная жалоба"}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    changeStatus({ id: item.id, status: "cancelled" })
                                }}
                            />
                            <Button
                                stretched
                                children={"Скрыть перевод"}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    changeStatus({ id: item.id, status: "resolved" })
                                }}
                            />
                        </ButtonGroup>
                    </div>
                ))}
            </Div>
            {items?.length === 0 && isSuccess && (
                <Placeholder icon={<Icon56ReportOutline />} children={"Ничего не найдено"} />
            )}
            <ModalWindow {...translationView} fullscreen={true}>
                {selectedTranslation && (
                    <TranslationView id={selectedTranslation} onClose={translationView.close} />
                )}
            </ModalWindow>
        </>
    )
}
