import { Caption } from "@vkontakte/vkui"
import { cn } from "../../../shared/helpers/cn"


type CorrectAnswerBadgeProps = {
    type: "correct" | "incorrect"
}

export const CorrectAnswerBadge = ({ type }: CorrectAnswerBadgeProps) => {
    return (
        <>
            <div
                className={cn(
                    "flex flex-row gap-1 rounded items-center p-1 text-white",
                    type === "correct" && "bg-dynamic-green",
                    type === "incorrect" && "bg-dynamic-red"
                )}
            >
                <Caption caps>{type === "correct" ? "Верно" : "Неверно"}</Caption>
            </div>
        </>
    )
}
