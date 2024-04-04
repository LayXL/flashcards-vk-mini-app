import { Text, Title } from "@vkontakte/vkui"
import { plural } from "../../../shared/helpers/plural"

type PrizePlaceProps = {
    place: 1 | 2 | 3
    name: string
    points: number
    avatarUrl: string
}

export const PrizePlace = ({ name, points, avatarUrl, place }: PrizePlaceProps) => {
    return (
        <div className={"flex flex-col gap-2 items-center select-none"}>
            <div
                className={
                    "aspect-square rounded-full w-[var(--width)] bg-[var(--color)] p-[3px] relative"
                }
                style={{
                    "--color": place === 1 ? "#FEC106" : place === 2 ? "#A9BBC5" : "#E96F2B",
                    "--width": place === 1 ? "100px" : "72px",
                }}
            >
                <div
                    className={
                        "absolute bg-[var(--color)] rounded-full w-6 aspect-square flex items-center justify-center"
                    }
                >
                    <Title level={"3"} weight={"2"} children={place} className={"text-white"} />
                </div>
                <div className={"bg-vk-content rounded-full p-[3px] w-full h-full box-border"}>
                    <div className={"bg-vk-secondary rounded-full w-full h-full box-border"}>
                        <div
                            className={"rounded-full w-full h-full"}
                            style={{
                                backgroundImage: `url(${avatarUrl})`,
                                backgroundSize: "cover",
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={"flex flex-col gap-1 items-center text-center"}>
                <Text children={name} />
                <Text
                    children={plural(points, ["балл", "балла", "баллов"])}
                    className={"text-subhead"}
                />
            </div>
        </div>
    )
}
