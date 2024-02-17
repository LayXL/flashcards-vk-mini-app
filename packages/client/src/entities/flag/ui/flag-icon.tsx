import flags from "../lib/flags"

type FlagIconProps = {
    flag: keyof typeof flags
    height?: number
    width?: number
    round?: boolean
}

export const FlagIcon = ({ flag, height = 16, width, round = false }: FlagIconProps) => {
    const Icon = flags[flag]

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
