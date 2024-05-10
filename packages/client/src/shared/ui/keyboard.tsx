import { Icon24Done } from "@vkontakte/icons"
import bridge from "@vkontakte/vk-bridge"
import { ClassValue } from "clsx"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "../helpers/cn"

const keys = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"]

type KeyProps = {
    letter: ReactNode
    onClick: () => void
    className?: ClassValue
    type?: "default" | "excluded" | "correct" | "misplaced"
}

const Key = ({ letter, onClick, className, type = "default" }: KeyProps) => {
    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className={cn(
                "w-[28px] aspect-[3/5] rounded-xl cursor-pointer flex items-center justify-center",
                "min-[370px]:w-[32px]",
                "min-[480px]:w-[36px]",
                "select-none",
                "animate-fade-in transition-colors",
                type === "default" && "bg-vk-content",
                type === "correct" && "bg-green-400 dark:bg-green-500",
                type === "excluded" && "bg-gray-300 dark:bg-gray-500",
                type === "misplaced" && "bg-yellow-400 dark:bg-yellow-500",
                className
            )}
            onPointerUp={() => {
                bridge.send("VKWebAppTapticSelectionChanged", {})
                onClick?.()
            }}
        >
            {typeof letter === "string" ? <span children={letter} /> : letter}
        </motion.div>
    )
}

type KeyboardProps = {
    onType: (letter: string) => void
    onEnter: () => void
    onBackspace: () => void
    correctLetters: string[]
    misplacedLetters: string[]
    excludedLetters: string[]
    highlightEnter?: boolean
}

export const Keyboard = ({
    onType,
    onEnter,
    onBackspace,
    correctLetters,
    excludedLetters,
    misplacedLetters,
    highlightEnter,
}: KeyboardProps) => {
    return (
        <div
            className={
                "flex-col items-center gap-2 pt-2 px-1 bg-vk-secondary rounded-t-xl pb-[calc(env(safe-area-inset-bottom)_+_8px)]"
            }
        >
            {keys.map((row, i) => (
                <div key={i} className={"flex flex-row gap-1.5 w-full justify-center"}>
                    {i === 2 && (
                        <Key
                            letter={<Icon24Done />}
                            className={cn(
                                "w-auto flex-1 aspect-[unset] px-1 max-w-12",
                                highlightEnter && "bg-learning-red"
                            )}
                            onClick={onEnter}
                        />
                    )}

                    {row.split("").map((letter, j) => (
                        <Key
                            letter={letter}
                            key={j}
                            onClick={() => onType(letter)}
                            type={
                                correctLetters?.includes(letter)
                                    ? "correct"
                                    : misplacedLetters?.includes(letter)
                                    ? "misplaced"
                                    : excludedLetters?.includes(letter)
                                    ? "excluded"
                                    : "default"
                            }
                        />
                    ))}

                    {i === 2 && (
                        <Key
                            letter={"⌫"}
                            className={
                                "w-auto flex-1 aspect-[unset] px-1 max-w-12 text-learning-red text-2xl"
                            }
                            onClick={onBackspace}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
