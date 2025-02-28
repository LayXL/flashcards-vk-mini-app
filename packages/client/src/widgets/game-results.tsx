import { Icon12CheckCircle, Icon12ClockOutline, Icon32CheckbitOutline } from "@vkontakte/icons"
import {
    Button,
    Caption,
    Div,
    Header,
    ModalPageHeader,
    PanelHeaderBack,
    Title,
} from "@vkontakte/vkui"
import { motion, useAnimationControls } from "framer-motion"
import { DateTime } from "luxon"
import { ReactNode, useState } from "react"
import { useBoolean, useStep } from "usehooks-ts"
import { StackBackground } from "../entities/stack/ui/stack-background"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { AnimatedNumber } from "../shared/ui/animated-number"
import { TranslationAddToStack } from "./translation-add-to-stack"
import { TranslationView } from "./translation-view"

type GameResultsProps = {
    id: number
    onClose: () => void
}

export const GameResults = ({ id, onClose }: GameResultsProps) => {
    const { data } = trpc.game.getGameResults.useQuery(id)

    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)

    const translationViewModal = useModalState()
    const translationAddModal = useModalState()

    const roundedAccuracy = Math.round((data?.answerAccuracy ?? 0) * 100)

    const controls = useAnimationControls()
    const [currentStep, { goToNextStep }] = useStep(2)

    if (!data) return null

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Результат"}
            />

            <div className={"h-full overflow-hidden"}>
                <div className={"h-full relative"}>
                    <motion.div
                        className={"absolute inset-0 flex-col items-center justify-center gap-5"}
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
                                type: "spring",
                            }}
                            className={cn(
                                "aspect-square w-[300px] max-w-full overflow-hidden",
                                data.type === "ranked" && "mb-8 -mt-8",
                                data.type !== "ranked" && "bg-secondary rounded-xl w-[200px]"
                            )}
                        >
                            {data.type === "ranked" ? (
                                <img
                                    className={"rounded-xl w-full h-full object-cover"}
                                    src={"/cat.svg"}
                                    alt={""}
                                />
                            ) : (
                                data?.stacks &&
                                data.stacks.length > 0 && (
                                    <StackBackground
                                        encodedBackground={data?.stacks[0].encodedBackground}
                                    />
                                )
                            )}
                        </motion.div>

                        <Title level={"1"} weight={"1"}>
                            <motion.span>
                                {(data.type === "ranked" ? "Игра завершена" : "Коллекция пройдена!")
                                    .split("")
                                    .map((char, i) => (
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
                            className={
                                "w-full flex gap-3 px-horizontal-regular py-vertical-regular box-border"
                            }
                            initial={"hidden"}
                            animate={"show"}
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
                            {data?.type === "default" && (
                                <>
                                    <Stat
                                        caption={"Верно"}
                                        value={data.points}
                                        icon={
                                            <Icon32CheckbitOutline
                                                height={12}
                                                width={12}
                                                className={"text-accent"}
                                            />
                                        }
                                    />
                                    <Stat
                                        caption={"Время"}
                                        value={
                                            data?.finalGameTime > 0
                                                ? data.finalGameTime
                                                : Math.round(
                                                      DateTime.now()
                                                          .diff(DateTime.fromISO(data?.startedAt))
                                                          .as("seconds")
                                                  )
                                        }
                                        icon={<Icon12ClockOutline className={"text-accent"} />}
                                        unit={"сек"}
                                    />
                                    <Stat
                                        caption={"Результат"}
                                        value={roundedAccuracy}
                                        icon={
                                            <Icon12CheckCircle className={"text-dynamic-green"} />
                                        }
                                        unit={"%"}
                                    />
                                </>
                            )}
                            {data?.type === "ranked" && (
                                <>
                                    <Stat
                                        caption={"Баллы"}
                                        value={data.points}
                                        icon={
                                            <Icon32CheckbitOutline
                                                height={12}
                                                width={12}
                                                className={"text-accent"}
                                            />
                                        }
                                    />
                                    <Stat
                                        caption={"Отлично"}
                                        value={roundedAccuracy}
                                        icon={
                                            <Icon12CheckCircle className={"text-dynamic-green"} />
                                        }
                                        unit={"%"}
                                    />
                                </>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={"absolute inset-0 flex-col"}
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
                        <Div className={"flex gap-3"}>
                            {data?.type === "default" && (
                                <>
                                    <Stat
                                        caption={"Верно"}
                                        value={data.points}
                                        icon={
                                            <Icon32CheckbitOutline
                                                height={12}
                                                width={12}
                                                className={"text-accent"}
                                            />
                                        }
                                    />
                                    <Stat
                                        caption={"Время"}
                                        value={
                                            data?.finalGameTime > 0
                                                ? data.finalGameTime
                                                : Math.round(
                                                      DateTime.now()
                                                          .diff(DateTime.fromISO(data?.startedAt))
                                                          .as("seconds")
                                                  )
                                        }
                                        icon={<Icon12ClockOutline className={"text-accent"} />}
                                        unit={"сек"}
                                    />
                                    <Stat
                                        caption={"Результат"}
                                        value={roundedAccuracy}
                                        icon={
                                            <Icon12CheckCircle className={"text-dynamic-green"} />
                                        }
                                        unit={"%"}
                                    />
                                </>
                            )}
                            {data?.type === "ranked" && (
                                <>
                                    <Stat
                                        caption={"Баллы"}
                                        value={data.points}
                                        icon={
                                            <Icon32CheckbitOutline
                                                height={12}
                                                width={12}
                                                className={"text-accent"}
                                            />
                                        }
                                    />
                                    <Stat
                                        caption={"Отлично"}
                                        value={roundedAccuracy}
                                        icon={
                                            <Icon12CheckCircle className={"text-dynamic-green"} />
                                        }
                                        unit={"%"}
                                    />
                                </>
                            )}
                        </Div>

                        <Header children={"Ответы"} mode={"secondary"} />

                        <div className={"flex-col flex-1 overflow-scroll pb-36"}>
                            {data.translations
                                .filter((x) => x.status !== "unanswered")
                                .map((x) => (
                                    <>
                                        <Header
                                            mode={"primary"}
                                            children={x.translation.vernacular}
                                            indicator={
                                                <Caption children={x.answerDuration + " сек"} />
                                            }
                                        />
                                        <Div
                                            key={x.translationId}
                                            className={"flex gap-3 py-0 [&>*]:flex-1"}
                                        >
                                            {x.incorrectTranslation && (
                                                <TranslationCard
                                                    foreign={x.incorrectTranslation?.foreign}
                                                    vernacular={x.incorrectTranslation?.vernacular}
                                                    onClick={() => {
                                                        vibrateOnClick()
                                                        translationViewModal.open()
                                                        setSelectedTranslation(
                                                            x.incorrectTranslation.id
                                                        )
                                                    }}
                                                    onAdd={() => {
                                                        vibrateOnClick()
                                                        translationAddModal.open()
                                                        setSelectedTranslation(
                                                            x.incorrectTranslation.id
                                                        )
                                                    }}
                                                    type={
                                                        x.status === "incorrect"
                                                            ? "incorrect"
                                                            : "default"
                                                    }
                                                />
                                            )}
                                            <TranslationCard
                                                foreign={x.translation.foreign}
                                                vernacular={x.translation.vernacular}
                                                onClick={() => {
                                                    vibrateOnClick()
                                                    translationViewModal.open()
                                                    setSelectedTranslation(x.translation.id)
                                                }}
                                                onAdd={() => {
                                                    vibrateOnClick()
                                                    translationAddModal.open()
                                                    setSelectedTranslation(x.translation.id)
                                                }}
                                                type={
                                                    x.status === "correct" ? "correct" : "default"
                                                }
                                            />
                                        </Div>
                                    </>
                                ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <Div className={"box-border fixed w-full bottom-0 bg-vk-content"}>
                <Button
                    children={"Продолжить"}
                    stretched={true}
                    size={"l"}
                    onClick={() => {
                        if (currentStep === 1) {
                            controls.start("second")
                            goToNextStep()
                        } else {
                            onClose()
                        }
                    }}
                />
                <div className={"h-safe-area-bottom"} />
            </Div>

            <ModalWrapper
                isOpened={translationViewModal.isOpened}
                onClose={translationViewModal.close}
            >
                <ModalBody fullscreen={true}>
                    {selectedTranslation && (
                        <TranslationView
                            id={selectedTranslation}
                            onClose={translationViewModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={translationAddModal.isOpened}
                onClose={translationAddModal.close}
            >
                <ModalBody fullscreen={true}>
                    {selectedTranslation && (
                        <TranslationAddToStack
                            translationId={selectedTranslation}
                            onClose={translationAddModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>
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
            className={"flex-1"}
            onAnimationComplete={setTrue}
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                },
            }}
        >
            <div className={"bg-secondary p-3 shadow-card rounded-xl flex-col gap-1"}>
                <div className={"gap-1 flex items-center"}>
                    {icon}
                    <Caption className={"text-subhead"} caps={true} children={caption} />
                </div>
                <Title level={"2"} weight={"1"}>
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
