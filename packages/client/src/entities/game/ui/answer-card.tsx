import { Icon28AddSquareOutline } from "@vkontakte/icons"
import { Headline, Subhead } from "@vkontakte/vkui"
import { CorrectAnswerBadge } from "./correct-answer-badge"

type AnswerCardProps = {
    foreign: string
    vernacular: string
    time: number
    type: "correct" | "incorrect"
    onClick: () => void
    onAdd: () => void
}

export const AnswerCard = ({
    type: status,
    foreign,
    vernacular,
    time,
    onClick,
    onAdd,
}: AnswerCardProps) => {
    return (
        <div
            className={"flex flex-col bg-secondary p-3 rounded-xl gap-3 cursor-pointer shadow-card"}
            onClick={onClick}
        >
            <div className={"flex flex-row justify-between items-center"}>
                <div className={"flex flex-row gap-1.5 items-center"}>
                    <Headline children={foreign} weight={"2"} />
                    <CorrectAnswerBadge type={status} />
                </div>
                <Subhead className={"text-secondary"}>{time} сек</Subhead>
            </div>
            <div className={"flex flex-row justify-between items-center text-secondary"}>
                <Subhead children={vernacular} />
                <div
                    className={"text-accent cursor-pointer"}
                    onClick={(e) => {
                        e.stopPropagation()
                        onAdd()
                    }}
                >
                    <Icon28AddSquareOutline />
                </div>
            </div>
        </div>
    )
}
