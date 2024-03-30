import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Icon16Add, Icon16Pen } from "@vkontakte/icons"
import { IconButton } from "@vkontakte/vkui"
import { useMemo, useState } from "react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterOutput, trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationAdd } from "./translation-add"
import { TranslationView } from "./translation-view"

type Translation = RouterOutput["translations"]["getUserTranslations"][number]

export const TranslationsTable = () => {
    const { data, refetch } = trpc.translations.getUserTranslations.useQuery()

    const [selectedId, setSelectedId] = useState<number | null>(null)

    const editDefaultValues = useMemo(
        () => data?.find((t) => t.id === selectedId),
        [data, selectedId]
    )

    const viewModal = useModalState(false)
    const editModal = useModalState(false)
    const addModal = useModalState(false)

    const columnHelper = createColumnHelper<Translation>()

    const table = useReactTable({
        columns: [
            columnHelper.display({
                id: "actions",
                header: () => (
                    <IconButton
                        onClick={() => {
                            addModal.open()
                        }}
                        children={<Icon16Add />}
                    />
                ),
                cell: (info) => (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(info.row.original.id)
                            editModal.open()
                        }}
                        children={<Icon16Pen />}
                    />
                ),
            }),
            columnHelper.accessor("foreign", {
                header: "На иностранном языке",
            }),
            columnHelper.accessor("vernacular", {
                header: "На родном языке",
            }),
            columnHelper.accessor("foreignDescription", {
                header: "Описание на языке перевода",
            }),
            columnHelper.accessor("transcriptions", {
                header: "Транскрипция",
                cell: (info) => info.getValue().map((t) => <p>{t.transcription}</p>),
            }),
            columnHelper.accessor("example", {
                header: "Пример использования",
            }),
        ],
        data: data ?? [],
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className={"bg-vk-modal rounded-xl"}>
                            {headerGroup.headers.map((header) => (
                                <th className={"py-3 px-1.5 font-semibold"} key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className={"[&>*:nth-child(even)]:bg-vk-secondary"}>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            className={"cursor-pointer"}
                            key={row.id}
                            onClick={() => {
                                setSelectedId(row.original.id)
                                viewModal.open()
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td className={"py-3 px-1.5"} key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalWrapper isOpened={editModal.isOpened} onClose={editModal.close}>
                <ModalBody fullscreen>
                    {editDefaultValues && (
                        <TranslationAdd
                            onAdd={() => {
                                editModal.close()
                                refetch()
                            }}
                            onClose={editModal.close}
                            defaultValues={{
                                id: editDefaultValues.id,
                                languageVariationId:
                                    editDefaultValues.languageVariationId ?? undefined,
                                foreign: editDefaultValues.foreign,
                                vernacular: editDefaultValues.vernacular,
                                languageId: editDefaultValues.languageId,
                                example: editDefaultValues.example ?? undefined,
                                foreignDescription:
                                    editDefaultValues.foreignDescription ?? undefined,
                                tags: editDefaultValues.tags.map(({ name }) => name),
                                transcriptions: editDefaultValues.transcriptions,
                            }}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={addModal.isOpened} onClose={addModal.close}>
                <ModalBody fullscreen>
                    <TranslationAdd
                        onAdd={() => {
                            addModal.close()
                            refetch()
                        }}
                        onClose={addModal.close}
                    />
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={viewModal.isOpened} onClose={viewModal.close}>
                <ModalBody fullscreen>
                    {selectedId && <TranslationView id={selectedId} onClose={viewModal.close} />}
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
