import { Icon28AddSquareOutline } from "@vkontakte/icons"
import { CorrectAnswerBadge } from "./correct-answer-badge"
import { Subhead } from "@vkontakte/vkui"

type AnswerCardProps = {
    foreign: string
    vernacular: string
    time: number
    type: "correct" | "incorrect"
}

export const AnswerCard = ({ type: status, foreign, vernacular, time }: AnswerCardProps) => {
    return (
        <>
            <div className="flex flex-col bg-secondary p-3 rounded-xl">
                <div className="flex flex-row gap-[6px]">
                    {foreign}
                    <CorrectAnswerBadge type={status} />
                </div>
                <div className="flex flex-row justify-between items-center text-secondary">
                    <Subhead>{vernacular}</Subhead>
                    <Icon28AddSquareOutline />
                </div>
            </div>
        </>
    )
}
