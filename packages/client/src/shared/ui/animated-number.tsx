import { useEffect, useState } from "react"

type AnimatedNumberProps = {
    from: number
    to: number
    duration?: number
}

export const AnimatedNumber = ({ from = 0, to, duration = 1000 }: AnimatedNumberProps) => {
    const [currentNumber, setCurrentNumber] = useState(from)

    useEffect(() => {
        const startTime = Date.now()
        const endTime = startTime + duration * 1000
        const range = to - from
        let intervalId

        const updateNumber = () => {
            const now = Date.now()
            const progress = Math.min(1, (now - startTime) / duration)
            const animatedValue = from + range * progress
            setCurrentNumber(animatedValue)

            if (now >= endTime) {
                clearInterval(intervalId)
            }
        }

        intervalId = setInterval(updateNumber, 16)

        return () => {
            clearInterval(intervalId)
        }
    }, [from, to, duration])

    return currentNumber.toFixed(0)
}
