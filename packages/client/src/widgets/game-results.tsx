import { Icon12CheckCircle, Icon12ClockOutline, Icon32CheckbitOutline } from "@vkontakte/icons"
import {
    Button,
    Caption,
    Div,
    FixedLayout,
    ModalPageHeader,
    PanelHeaderBack,
    Title,
} from "@vkontakte/vkui"
import { motion, useAnimationControls } from "framer-motion"
import { ReactNode } from "react"
import { useBoolean } from "usehooks-ts"
import { trpc } from "../shared/api"
import { AnimatedNumber } from "../shared/ui/animated-number"
import { AnswerCard } from "../entities/game/ui/answer-card"

type GameResultsProps = {
    id: number
    onClose: () => void
}

export const GameResults = ({ id, onClose }: GameResultsProps) => {
    const { data } = trpc.game.getGameResults.useQuery(id)

    const roundedAccuracy = Math.round((data?.answerAccuracy ?? 0) * 100)

    const controls = useAnimationControls()

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Результат"}
            />

            <div className="h-full relative">
                <motion.div
                    className="absolute inset-0 flex-col items-center justify-center gap-5"
                    animate={controls}
                    initial={"first"}
                    variants={{
                        first: {
                            translateY: 0,
                        },
                        second: {
                            translateY: "100%",
                        },
                    }}
                >
                    <motion.div
                        initial={{
                            scale: 10,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="aspect-square w-[200px] bg-secondary rounded-xl"
                    ></motion.div>

                    <Title level="1" weight="1">
                        <motion.span>
                            {"Стопка пройдена!".split("").map((char, i) => (
                                <motion.span
                                    initial={{ visibility: "hidden" }}
                                    animate={{ visibility: "visible" }}
                                    transition={{
                                        delay: 0.6 + i * 0.02,
                                    }}
                                    key={i}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.span>
                    </Title>

                    <motion.div
                        className="w-full flex gap-3 px-horizontal-regular py-vertical-regular box-border"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.3,
                                    delayChildren: 0.6,
                                },
                            },
                        }}
                    >
                        <Stat
                            caption={"Баллы"}
                            value={100}
                            icon={
                                <Icon32CheckbitOutline
                                    height={12}
                                    width={12}
                                    className="text-accent"
                                />
                            }
                        />
                        <Stat
                            caption={"Время"}
                            value={100}
                            icon={<Icon12ClockOutline className="text-accent" />}
                            unit="сек"
                        />
                        <Stat
                            caption={"Отлично"}
                            value={roundedAccuracy}
                            icon={<Icon12CheckCircle className="text-dynamic-green" />}
                            unit="%"
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute inset-0"
                    animate={controls}
                    initial={"first"}
                    variants={{
                        first: {
                            translateY: "100%",
                        },
                        second: {
                            translateY: 0,
                        },
                    }}
                >
                    <Div className="flex gap-3">
                        <Stat
                            caption={"Баллы"}
                            value={100}
                            icon={
                                <Icon32CheckbitOutline
                                    height={12}
                                    width={12}
                                    className="text-accent"
                                />
                            }
                        />
                        <Stat
                            caption={"Время"}
                            value={100}
                            icon={<Icon12ClockOutline className="text-accent" />}
                            unit="сек"
                        />
                        <Stat
                            caption={"Отлично"}
                            value={roundedAccuracy}
                            icon={<Icon12CheckCircle className="text-dynamic-green" />}
                            unit="%"
                        />
                    </Div>

                    <Div className="flex-col gap-2">
                        {data?.translations?.map((translation) => (
                            <AnswerCard foreign={translation.translation.foreign} vernacular={translation.translation.vernacular} time={0} type={translation.status}/>
                        ))}
                    </Div>
                </motion.div>
            </div>

            <FixedLayout vertical="bottom" filled>
                <Div>
                    <Button
                        children="Продолжить"
                        stretched={true}
                        size={"l"}
                        onClick={() => {
                            controls.start("second")
                        }}
                    />
                </Div>
            </FixedLayout>
        </>
    )
}

type StatProps = {
    icon?: ReactNode
    caption: string
    value: number
    unit?: string
}

const Stat = ({ icon, caption, value = 0, unit }: StatProps) => {
    const { value: isAnimationCompleted, setTrue } = useBoolean(false)

    return (
        <motion.div
            className="flex-1"
            onAnimationComplete={setTrue}
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                },
            }}
        >
            <div className="bg-secondary p-3 shadow-card rounded-xl flex-col gap-1">
                <div className="gap-1 flex items-center">
                    {icon}
                    <Caption className="text-subhead" caps={true} children={caption} />
                </div>
                <Title level="2" weight="1">
                    {isAnimationCompleted ? (
                        <AnimatedNumber from={0} to={value} duration={1000} />
                    ) : (
                        0
                    )}{" "}
                    <span children={unit} />
                </Title>
            </div>
        </motion.div>
    )
}
