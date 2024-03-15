import { cn } from "../../../shared/helpers/cn"

// TODO isSelected property
// TODO icon property
type ModifierCardProps = {
    name: string
    onClick?: () => void
    isSelected?: boolean
}

export const ModifierCard = ({ name, onClick, isSelected }: ModifierCardProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex-1 p-3 bg-secondary rounded-xl cursor-pointer flex justify-center items-center",
                isSelected && "bg-vk-accent",
            )}
        >
            <span>{name}</span>
        </div>
    )
}
