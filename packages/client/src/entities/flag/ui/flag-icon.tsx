import flags from "../lib/flags"

type FlagIconProps = {
    flag: keyof typeof flags
    height?: number
    width?: number
}

export const FlagIcon = ({ flag, height = 16, width }: FlagIconProps) => {
    const Icon = flags[flag]

    return <Icon style={{ height, width: width ? width : "auto" }} />
}
