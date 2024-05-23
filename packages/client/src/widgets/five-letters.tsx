import { FloatingPortal } from "@floating-ui/react"
import {
    Icon16Cancel,
    Icon16ErrorCircleOutline,
    Icon28HideOutline,
    Icon28InfoOutline,
    Icon28ViewOutline,
} from "@vkontakte/icons"
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge"
import { Div, ModalPageHeader, PanelHeaderBack, PanelHeaderButton, Spacing } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { isDesktop } from "react-device-detect"
import { useModal } from "../features/modal/contexts/modal-context"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { vibrateOnError } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { useOnboardingCompletion } from "../shared/hooks/useOnboardingCompletion"
import { Keyboard } from "../shared/ui/keyboard"
import { LetterCell } from "../shared/ui/letter-cell"
import { FiveLettersOnboarding } from "./five-letters-onboarding"

const limitToFiveLetters = (x: string) => {
    if (x.length > 5) {
        return x.slice(0, 5)
    }

    return x
}

export const FiveLetters = ({ onClose }: { onClose: () => void }) => {
    const [hideLetters, setHideLetters] = useState(false)

    const modal = useModal()

    const fiveLettersOnboardingCompletion = useOnboardingCompletion("fiveLetters2")
    const onboardingModal = useModalState(false, {
        onClose: () => fiveLettersOnboardingCompletion.complete(),
    })

    useEffect(() => {
        if (
            !fiveLettersOnboardingCompletion.isCompleted &&
            typeof fiveLettersOnboardingCompletion.isCompleted === "boolean"
        ) {
            onboardingModal.open()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fiveLettersOnboardingCompletion.isCompleted])

    const utils = trpc.useUtils()
    const { data, isSuccess } = trpc.fiveLetters.getTodayAttempts.useQuery()

    const { mutate: answer, isPending } = trpc.fiveLetters.answer.useMutation({
        onSuccess: (data) => {
            utils.fiveLetters.getTodayAttempts.setData(undefined, data)
            utils.getUser.invalidate()
            utils.stats.getDailyStreak.invalidate()
            utils.stats.getActiveDays.invalidate()
            setValue("")
        },
        onError: () => {
            vibrateOnError()
            setIsValueWithError(true)
        },
    })

    const currentAttempt = data?.attempts.length

    const inputRef = useRef<HTMLInputElement>(null)

    const [value, setValue] = useState("")
    const [isValueWithError, setIsValueWithError] = useState(false)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (isValueWithError) {
            timeout = setTimeout(() => {
                setIsValueWithError(false)
            }, 2000)
        }

        return () => clearTimeout(timeout)
    }, [setIsValueWithError, isValueWithError])

    useEffect(() => {
        bridge.send("VKWebAppHideBannerAd")

        return () => {
            bridge.send("VKWebAppShowBannerAd", {
                banner_location: BannerAdLocation.BOTTOM,
            })
        }
    })

    return (
        <>
            <ModalPageHeader
                children={"5 букв"}
                before={<PanelHeaderBack onClick={onClose} />}
                after={
                    <>
                        <PanelHeaderButton
                            onClick={() => setHideLetters(!hideLetters)}
                            children={hideLetters ? <Icon28ViewOutline /> : <Icon28HideOutline />}
                        />
                        <PanelHeaderButton
                            onClick={() => onboardingModal.open()}
                            children={<Icon28InfoOutline />}
                        />
                    </>
                }
            />

            {data?.status === "playing" && (
                <input
                    className={"h-0 absolute opacity-0 -z-0"}
                    ref={inputRef}
                    value={value}
                    onChange={({ currentTarget: { value } }) => {
                        setValue(limitToFiveLetters(value.toUpperCase()))
                        setIsValueWithError(false)
                    }}
                    enterKeyHint={"send"}
                    onKeyDown={(e) => {
                        if (isPending) return
                        if (e.key !== "Enter") return

                        answer(value)
                    }}
                />
            )}

            <div
                className={"flex-col select-none"}
                onClick={() => {
                    if (isDesktop) inputRef.current?.focus()
                }}
            >
                <div className={"flex-col gap-1 items-center py-4"}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div className={"flex-row gap-1"} key={i}>
                            {currentAttempt === i ? (
                                <>
                                    <LetterCell
                                        letter={!hideLetters ? value[0] : undefined}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={!hideLetters ? value[1] : undefined}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={!hideLetters ? value[2] : undefined}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={!hideLetters ? value[3] : undefined}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={!hideLetters ? value[4] : undefined}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                </>
                            ) : (
                                <>
                                    {data?.attempts[i]?.map(({ letter, type }, i) => (
                                        <LetterCell
                                            key={i}
                                            letter={!hideLetters ? letter : undefined}
                                            type={type}
                                        />
                                    )) ?? (
                                        <>
                                            <LetterCell />
                                            <LetterCell />
                                            <LetterCell />
                                            <LetterCell />
                                            <LetterCell />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {data?.status !== "playing" && isSuccess && (
                    <Div className={"flex-col gap-1 flex-1 py-8"}>
                        <div className={"font-semibold text-2xl text-center"}>
                            {data?.status === "lost" && "Вы не угадали слово"}
                            {data?.status === "resolved" && "Вы угадали слово"}
                        </div>
                        <div className={"text-center"}>
                            Игра обновится через{" "}
                            {DateTime.now()
                                .toUTC(0)
                                .endOf("day")
                                .diffNow()
                                .rescale()
                                .set({ millisecond: 0, second: 0 })
                                .rescale()
                                .toHuman()
                                .replace(/\s/g, " ")}
                        </div>

                        {data?.status === "lost" && data?.answer && (
                            <div className={"flex-row gap-1 mx-auto py-8"}>
                                {data.answer
                                    ?.toUpperCase()
                                    .split("")
                                    .map((letter, i) => (
                                        <LetterCell letter={letter} key={i} type={"correct"} />
                                    ))}
                            </div>
                        )}

                        {/* <div className={"py-3 mx-auto"}>
                            <Button
                                size={"l"}
                                mode={"secondary"}
                                onClick={() => {
                                    bridge.send("VKWebAppShare", {
                                        link: "https://vk.com",
                                    })
                                }}
                                before={<Icon28ShareOutline />}
                                children={"Поделиться с друзьями"}
                            />
                        </div> */}
                    </Div>
                )}

                <Spacing size={256} />
            </div>

            {data?.status === "playing" && (
                <FloatingPortal>
                    <div
                        className={cn(
                            "fixed w-full bottom-0 flex flex-col gap-2",
                            modal?.isOpenedAnimation
                                ? "animate-content-appearing"
                                : "animate-content-disappearing"
                        )}
                    >
                        {isValueWithError && (
                            <div
                                className={
                                    "bg-learning-red p-3 rounded-xl text-center animate-fade-in flex items-center justify-center gap-2"
                                }
                            >
                                <Icon16ErrorCircleOutline width={20} height={20} />
                                <span>Используйте существующие слова</span>
                            </div>
                        )}
                        <Keyboard
                            correctLetters={hideLetters ? [] : data?.correctLetters ?? []}
                            excludedLetters={hideLetters ? [] : data?.excludedLetters ?? []}
                            misplacedLetters={hideLetters ? [] : data?.misplacedLetters ?? []}
                            onType={(letter) => {
                                setValue((prev) => limitToFiveLetters(prev + letter))
                                setIsValueWithError(false)
                            }}
                            onBackspace={() => {
                                setValue((prev) => prev.slice(0, -1))
                                setIsValueWithError(false)
                            }}
                            onEnter={() => {
                                if (isPending) return
                                answer(value)
                            }}
                            highlightEnter={value.length === 5}
                        />
                    </div>
                </FloatingPortal>
            )}

            <ModalWindow
                {...onboardingModal}
                title={"Как играть?"}
                buttonType={"none"}
                after={
                    <div
                        className={
                            "w-8 aspect-square flex items-center justify-center cursor-pointer bg-vk-secondary rounded-full opacity-75 text-primary"
                        }
                        onClick={onboardingModal.close}
                    >
                        <Icon16Cancel />
                    </div>
                }
            >
                <FiveLettersOnboarding onClose={onboardingModal.close} />
            </ModalWindow>
        </>
    )
}
