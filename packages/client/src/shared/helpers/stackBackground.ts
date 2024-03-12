import { trpc } from "../api"
export const encodeStackBackground = (
    pattern: string,
    primaryColor: string,
    secondaryColor: string,
) => {
    return `${pattern}:${primaryColor}:${secondaryColor}`
}

export const decodeStackBackground = (value?: string) => {
    if (!value) return null

    const [pattern, primaryColor, secondaryColor] = value?.split(":")
    return { pattern, primaryColor, secondaryColor }
}

export const useEncodeStackBackground = () => {
    const { data: palettes } = trpc.stacks.customization.getPalettes.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    if (!palettes) {
        return () => {
            return `solid:#0037EC:#0077FF`
        }
    }

    return (stackData: { palette: number; pattern: string }) => {
        if (!stackData.palette || !stackData.pattern) return `solid:#0037EC:#0077FF`

        return `${stackData.pattern}:${palettes[stackData.palette].primary}:${palettes[stackData.palette].secondary}`
    }
}
