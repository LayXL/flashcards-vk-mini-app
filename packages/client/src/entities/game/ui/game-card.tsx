import { Button, Title } from "@vkontakte/vkui"

type GameCardProps = {
    title: string
    choices: string[]
    onSelect: (choice: number) => void
}

export const GameCard = ({ title, choices, onSelect }: GameCardProps) => {
    return (
        <div className={"flex-col box-border"}>
            <div className={"h-[20px] overflow-hidden relative"}>
                <div
                    className={
                        "absolute left-[24px] right-[24px] rounded-2xl aspect-square bg-vk-modal opacity-75"
                    }
                ></div>
                <div
                    className={
                        "absolute left-[12px] right-[12px] top-[8px] rounded-2xl aspect-square bg-vk-modal"
                    }
                ></div>
            </div>
            <div className={"p-3 bg-vk-secondary rounded-2xl"}>
                <div
                    className={
                        "aspect-[4/3] max-h-[50vh] w-full flex-col gap-3 items-center justify-center"
                    }
                >
                    <Title children={title} />
                </div>

                <div className={"flex-col gap-3"}>
                    {choices.map((choice, i) => (
                        <Button
                            key={i}
                            stretched={true}
                            size={"l"}
                            children={choice}
                            onClick={() => onSelect(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
