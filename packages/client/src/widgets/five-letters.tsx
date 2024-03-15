import { Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { isDesktop } from "react-device-detect"
import { trpc } from "../shared/api"
import { Keyboard } from "../shared/ui/keyboard"
import { LetterCell } from "../shared/ui/letter-cell"

const limitToFiveLetters = (x: string) => {
    if (x.length > 5) {
        return x.slice(0, 5)
    }

    return x
}

export const FiveLetters = ({ onClose }: { onClose: () => void }) => {
    const utils = trpc.useUtils()
    const { data, isSuccess } = trpc.fiveLetters.getTodayAttempts.useQuery()

    const { mutate: answer, isPending } = trpc.fiveLetters.answer.useMutation({
        onSuccess: (data) => {
            utils.fiveLetters.getTodayAttempts.setData(undefined, data)
            setValue("")
        },
        onError: () => {
            setIsValueWithError(true)
        },
    })

    const currentAttempt = data?.attempts.length

    const inputRef = useRef<HTMLInputElement>(null)

    const [value, setValue] = useState("")
    const [isValueWithError, setIsValueWithError] = useState(false)

    return (
        <>
            <ModalPageHeader children={"5 букв"} before={<PanelHeaderBack onClick={onClose} />} />

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
                className={"h-full flex-col"}
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
                                        letter={value[0]}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={value[1]}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={value[2]}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={value[3]}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                    <LetterCell
                                        letter={value[4]}
                                        type={isValueWithError ? "error" : "default"}
                                    />
                                </>
                            ) : (
                                <>
                                    {data?.attempts[i]?.map(({ letter, type }, i) => (
                                        <LetterCell key={i} letter={letter} type={type} />
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
                        <>
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
                        </>
                    </Div>
                )}
            </div>

            {data?.status === "playing" && (
                <div className={"fixed w-screen bottom-0"}>
                    <Keyboard
                        correctLetters={data?.correctLetters ?? []}
                        excludedLetters={data?.excludedLetters ?? []}
                        misplacedLetters={data?.misplacedLetters ?? []}
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
                    />
                </div>
            )}
        </>
    )
}
