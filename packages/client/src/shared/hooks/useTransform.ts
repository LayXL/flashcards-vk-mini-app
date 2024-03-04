export function useTransform(input, inputRange, outputRange, clamp = false) {
    const [minInput, maxInput] = inputRange
    const [minOutput, maxOutput] = outputRange

    let output = ((input - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) + minOutput

    if (clamp) {
        output = Math.min(Math.max(output, minOutput), maxOutput)
    }

    return output
}
