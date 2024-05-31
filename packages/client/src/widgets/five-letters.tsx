import { FloatingPortal } from "@floating-ui/react"
import {
    Icon16Cancel,
    Icon16ErrorCircleOutline,
    Icon24ShareOutline,
    Icon28HideOutline,
    Icon28InfoOutline,
    Icon28ViewOutline,
} from "@vkontakte/icons"
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge"
import {
    Button,
    Div,
    ModalPageHeader,
    PanelHeaderBack,
    PanelHeaderButton,
    Spacing,
} from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { isDesktop } from "react-device-detect"
import { useModal } from "../features/modal/contexts/modal-context"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { RouterOutput, trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { vibrateOnError } from "../shared/helpers/vibrate"
import { useModalState } from "../shared/hooks/useModalState"
import { useOnboardingCompletion } from "../shared/hooks/useOnboardingCompletion"
import { Keyboard } from "../shared/ui/keyboard"
import { LetterCell } from "../shared/ui/letter-cell"
import { FiveLettersOnboarding } from "./five-letters-onboarding"

const limitToFiveLetters = (x: string) => {
    if (x.length > 5) return x.slice(0, 5)
    return x
}

const imageUrlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader()
            reader.onload = function () {
                resolve(this.result as string)
            }
            reader.readAsDataURL(blob)
        } catch (e) {
            reject(e)
        }
    })
}

const generateStory = async (data: RouterOutput["fiveLetters"]["getTodayAttempts"]) => {
    const userInfo = await bridge.send("VKWebAppGetUserInfo")

    const avatar = await imageUrlToBase64(userInfo.photo_200)
    const background = await imageUrlToBase64("/fiveLetters/background.png")
    const phone = await imageUrlToBase64("/fiveLetters/phone.png")

    const defaultSquare = await imageUrlToBase64("/fiveLetters/default.png")
    const correctSquare = await imageUrlToBase64("/fiveLetters/correct.png")
    const excludedSquare = await imageUrlToBase64("/fiveLetters/excluded.png")
    const misplacedSquare = await imageUrlToBase64("/fiveLetters/misplaced.png")

    const canvas = document.createElement("canvas")

    const squareSize = 140
    const gap = 14

    canvas.width = 987
    canvas.height = 1888

    const ctx = canvas.getContext("2d")

    async function drawImage(
        image: string,
        x = 0,
        y = 0,
        width: number,
        height: number,
        rounded?: boolean
    ) {
        return new Promise<void>((resolve) => {
            const phoneImage = new Image()

            phoneImage.src = image

            phoneImage.onload = () => {
                if (!ctx) return

                ctx.save()

                if (rounded) {
                    ctx.beginPath()
                    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2, true)
                    ctx.closePath()
                    ctx.clip()
                }

                ctx.drawImage(phoneImage, x, y, width, height)

                ctx.restore()

                resolve()
            }
        })
    }

    await drawImage(phone, 0, 0, 987, 1888)
    await drawImage(avatar, 354, 311, 280, 280, true)

    const rows: ("excluded" | "correct" | "misplaced" | null)[][] = Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => null)
    )

    for (const i in rows) {
        for (const j in rows[i]) {
            const status = ((data.attempts[i] ?? [])[j] ?? []).type ?? null

            if (!ctx) return

            await drawImage(
                status === "correct"
                    ? correctSquare
                    : status === "misplaced"
                    ? misplacedSquare
                    : status === "excluded"
                    ? excludedSquare
                    : defaultSquare,
                116 + (parseInt(j) * squareSize + (parseInt(j) === 0 ? 0 : gap * parseInt(j))),
                682 + (parseInt(i) * squareSize + (parseInt(i) === 0 ? 0 : gap * parseInt(i))),
                squareSize,
                squareSize
            )
        }
    }

    bridge.send("VKWebAppShowStoryBox", {
        background_type: "image",
        blob: background,
        stickers: [
            {
                sticker_type: "renderable",
                sticker: {
                    original_width: 974,
                    original_height: 140,
                    clickable_zones: [
                        {
                            action_type: "link",
                            action: {
                                title: "Играть!",
                                link: "https://vk.com/app51843841#/fiveLetters",
                            },
                            clickable_area: [
                                {
                                    x: -9999,
                                    y: -9999,
                                },
                                {
                                    x: 9999,
                                    y: -9999,
                                },
                                {
                                    x: 9999,
                                    y: 9999,
                                },
                                {
                                    x: -9999,
                                    y: 9999,
                                },
                            ],
                        },
                    ],
                    content_type: "image",
                    blob: await imageUrlToBase64("/fiveLetters/button.png"),
                    can_delete: false,
                    transform: {
                        translation_y: -0.28,
                        relation_width: 0.9,
                    },
                },
            },
            {
                sticker_type: "renderable",
                sticker: {
                    content_type: "image",
                    blob: canvas.toDataURL("image/png"),
                    can_delete: false,
                    transform: {
                        relation_width: 0.71,
                        translation_y: 0.21,
                    },
                },
            },
            {
                sticker_type: "renderable",
                sticker: {
                    content_type: "image",
                    blob: await imageUrlToBase64("/fiveLetters/text.png"),
                    can_delete: true,
                    transform: {
                        translation_y: -0.37,
                        relation_width: 0.9,
                    },
                },
            },
        ],
    })
}

export const FiveLetters = ({ onClose }: { onClose: () => void }) => {
    const [hideLetters, setHideLetters] = useState(false)

    const [isStoryBoxLoading, setIsStoryBoxLoading] = useState(false)

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
    }, [])

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
                            <div className={"flex-row gap-1 mx-auto pt-8"}>
                                {data.answer
                                    ?.toUpperCase()
                                    .split("")
                                    .map((letter, i) => (
                                        <LetterCell
                                            letter={!hideLetters ? letter : undefined}
                                            key={i}
                                            type={"correct"}
                                        />
                                    ))}
                            </div>
                        )}

                        <div className={"mx-auto pt-4"}>
                            <Button
                                loading={isStoryBoxLoading}
                                size={"l"}
                                before={<Icon24ShareOutline />}
                                children={"Поделиться результатом"}
                                onClick={async () => {
                                    setIsStoryBoxLoading(true)
                                    await generateStory(data)
                                    setIsStoryBoxLoading(false)
                                }}
                            />
                        </div>

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
