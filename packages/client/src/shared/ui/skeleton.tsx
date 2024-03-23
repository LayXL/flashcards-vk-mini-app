import { ClassValue } from "clsx"
import { cn } from "../helpers/cn"

type SkeletonProps = {
    className?: ClassValue
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <span
            className={cn(
                "inline-block animate-pulse h-lh leading-none rounded-xl bg-vk-default",
                className
            )}
        />
    )
}
