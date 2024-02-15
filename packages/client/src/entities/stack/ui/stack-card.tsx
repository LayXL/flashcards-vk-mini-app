import { Card } from "@vkontakte/vkui"

type StackCardProps = {
    name: string
    onClick?: () => void
}

export const StackCard = ({ name, onClick }: StackCardProps) => {
    return (
        <Card style={{ padding: 16 }} onClick={onClick}>
            {name}
        </Card>
    )
}
