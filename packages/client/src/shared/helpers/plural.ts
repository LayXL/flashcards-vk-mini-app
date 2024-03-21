export const plural = (number: number, titles: string[], withNumber: boolean = true) => {
    const absoluteNumber = Math.abs(number)

    return (
        (withNumber ? number + " " : "") +
        titles[
            absoluteNumber % 10 == 1 && absoluteNumber % 100 != 11
                ? 0
                : absoluteNumber % 10 >= 2 &&
                  absoluteNumber % 10 <= 4 &&
                  (absoluteNumber % 100 < 10 || absoluteNumber % 100 >= 20)
                ? 1
                : 2
        ]
    )
}
