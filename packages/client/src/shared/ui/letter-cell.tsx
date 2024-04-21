import { Tooltip } from "@vkontakte/vkui"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../helpers/cn"

type LetterCellProps = {
    letter?: string
    type?: "default" | "excluded" | "correct" | "misplaced" | "error"
}

export const LetterCell = ({ letter, type = "default" }: LetterCellProps) => {
    return (
        <Tooltip
            placement={"bottom"}
            role={"tooltip"}
            className={"focus:outline-none text-center"}
            appearance={"inversion"}
            shown={["error", "default"].includes(type) ? false : undefined}
            text={
                type === "excluded"
                    ? "Этой буквы нет в слове"
                    : type === "misplaced"
                    ? "Буква стоит не на своём месте"
                    : type === "correct"
                    ? "Буква стоит в верной позиции"
                    : undefined
            }
        >
            <div
                className={cn(
                    "transition-colors animate-fade-in",
                    "h-16 aspect-square rounded-xl flex items-center justify-center",
                    "dark:text-white",
                    type === "default" && "bg-vk-secondary",
                    type === "correct" && "bg-green-400 dark:bg-green-500",
                    type === "excluded" && "bg-gray-300 dark:bg-gray-500",
                    type === "misplaced" && "bg-yellow-400 dark:bg-yellow-500",
                    type === "error" && "bg-red-400 dark:bg-red-500"
                )}
            >
                <AnimatePresence>
                    {letter && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={"text-3xl font-medium"}
                            children={letter}
                        />
                    )}
                </AnimatePresence>
            </div>
        </Tooltip>
    )
}
