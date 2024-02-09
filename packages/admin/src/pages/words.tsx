import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shared/ui/table"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

type Word = {
    id: number
    language: string
    original: string
    foreign: string
    usageExample: string
}

const payments: Word[] = [
    {
        id: 1,
        language: "Russian",
        original: "Туристический маршрут",
        foreign: "Tourist route",
        usageExample:
            "The tourist route takes you through the heart of the city, passing by all the major landmarks and attractions.",
    },
]

const columns: ColumnDef<Word>[] = [
    {
        accessorKey: "language",
        header: "Язык",
    },
    {
        accessorKey: "original",
        header: "Оригинал",
    },
    {
        accessorKey: "foreign",
        header: "На иностранном",
    },
    {
        accessorKey: "usageExample",
        header: "Пример использования",
    },
]

export const Words = () => {
    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-xl border m-4">
            <Table>
                <TableHeader
                    children={table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            children={headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    children={
                                        header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )
                                    }
                                />
                            ))}
                        />
                    ))}
                />
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
