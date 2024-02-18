import flags from "../lib/flags"

type FlagIconProps = {
    flag: string
    height?: number
    width?: number
    round?: boolean
}

export const FlagIcon = ({ flag, height = 16, width, round = false }: FlagIconProps) => {
    const Icon = flags[flag as keyof typeof flags]

    return (
        <Icon
            style={{
                height,
                width: width ? width : "auto",
                borderRadius: round ? "100%" : undefined,
            }}
        />
    )
}
