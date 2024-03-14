// TODO isSelected property
// TODO icon property
type ModifierCardProps = {
    name: string
    onClick?: () => void
}

export const ModifierCard = ({ name, onClick }: ModifierCardProps) => {
    return (
        <div
            onClick={onClick}
            className="flex-1 p-3 bg-secondary rounded-xl cursor-pointer flex justify-center items-center"
        >
            <span>{name}</span>
        </div>
    )
}
