import { cn } from "../helpers/cn"

type LetterCellProps = {
    letter?: string
    type?: "default" | "excluded" | "correct" | "misplaced" | "error"
}

export const LetterCell = ({ letter, type = "default" }: LetterCellProps) => {
    return (
        <div
            className={cn(
                "h-16 aspect-square rounded-xl flex items-center justify-center",
                type === "default" && "bg-vk-secondary",
                type === "correct" && "bg-green-500",
                type === "excluded" && "bg-gray-500",
                type === "misplaced" && "bg-yellow-500",
                type === "error" && "bg-red-500",
            )}
        >
            <span className="text-3xl font-medium" children={letter} />
        </div>
    )
}
