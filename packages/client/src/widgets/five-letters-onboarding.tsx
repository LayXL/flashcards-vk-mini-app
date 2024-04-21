import {
    Icon28CupOutline,
    Icon28Dice3Outline,
    Icon28MessageAddBadgeOutline,
} from "@vkontakte/icons"
import { Button, Div, Header, Subhead } from "@vkontakte/vkui"
import { cn } from "../shared/helpers/cn"

type FiveLettersOnboardingProps = {
    onClose?: () => void
}

export const FiveLettersOnboarding = ({ onClose }: FiveLettersOnboardingProps) => {
    return (
        <>
            <Header children={"Правила"} mode={"secondary"} />
            <Div className={"flex flex-col gap-4 pt-0"}>
                <div className={"flex gap-3 items-center"}>
                    <Icon28MessageAddBadgeOutline className={"text-accent"} />
                    <Subhead
                        className={"flex-1"}
                        children={"Каждый день мы загадываем новое английское слово из 5 букв"}
                    />
                </div>
                <div className={"flex gap-3 items-center"}>
                    <Icon28Dice3Outline className={"text-dynamic-yellow"} />
                    <Subhead
                        className={"flex-1"}
                        children={"У вас 6 попыток, чтобы угадать слово"}
                    />
                </div>
                <div className={"flex gap-3 items-center"}>
                    <Icon28CupOutline className={"text-dynamic-green"} />
                    <Subhead
                        className={"flex-1"}
                        children={"Когда вы угадаете слово, то все буквы окрасятся в зелёный цвет"}
                    />
                </div>
            </Div>
            <Header children={"Подсказки"} mode={"secondary"} />
            <Div className={"flex flex-col gap-4 pt-0"}>
                <Subhead children={"После каждой попытки цвет букв меняется:"} />
                <div className={"flex flex-col gap-2"}>
                    <div className={"flex gap-1 select-none"}>
                        <LetterCell letter={"B"} type={"excluded"} />
                        <LetterCell letter={"R"} type={"excluded"} />
                        <LetterCell letter={"O"} type={"excluded"} />
                        <LetterCell letter={"W"} type={"excluded"} />
                        <LetterCell letter={"N"} type={"excluded"} />
                    </div>
                    <Subhead
                        className={"text-secondary"}
                        children={"Серый означает, что такой буквы в слове нет"}
                    />
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"flex gap-1 select-none"}>
                        <LetterCell letter={"A"} type={"misplaced"} />
                        <LetterCell letter={"D"} type={"excluded"} />
                        <LetterCell letter={"M"} type={"misplaced"} />
                        <LetterCell letter={"I"} type={"excluded"} />
                        <LetterCell letter={"T"} type={"misplaced"} />
                    </div>
                    <Subhead
                        className={"text-secondary"}
                        children={
                            "Жёлтый указывает на то, что буква есть в слове, но стоит в других местах"
                        }
                    />
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"flex gap-1 select-none"}>
                        <LetterCell letter={"M"} type={"correct"} />
                        <LetterCell letter={"A"} type={"correct"} />
                        <LetterCell letter={"T"} type={"correct"} />
                        <LetterCell letter={"C"} type={"correct"} />
                        <LetterCell letter={"H"} type={"correct"} />
                    </div>
                    <Subhead
                        className={"text-secondary"}
                        children={
                            "Зелёный обозначает, что эта буква есть в слове и стоит на нужном месте"
                        }
                    />
                </div>
            </Div>
            <Div>
                <Button size={"l"} stretched children={"Понятно"} onClick={onClose} />
            </Div>
        </>
    )
}

const LetterCell = ({
    letter,
    type,
}: {
    letter: string
    type?: "excluded" | "misplaced" | "correct"
}) => (
    <div
        className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg",
            type === "correct" && "bg-green-400 dark:bg-green-500",
            type === "excluded" && "bg-gray-300 dark:bg-gray-500",
            type === "misplaced" && "bg-yellow-400 dark:bg-yellow-500"
        )}
    >
        <Subhead children={letter} weight={"1"} />
    </div>
)
