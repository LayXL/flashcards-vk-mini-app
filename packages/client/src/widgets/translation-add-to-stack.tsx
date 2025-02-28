import { useCallback } from "react"
import { trpc } from "../shared/api"
import { StackSelect } from "./stack-select"

type TranslationAddToStackProps = {
    title?: string
    translationId: number
    onClose: () => void
    onSuccess?: (id?: number) => void
}

export const TranslationAddToStack = ({
    title,
    translationId,
    onClose,
    onSuccess,
}: TranslationAddToStackProps) => {
    const utils = trpc.useUtils()

    const { mutate: addTranslationToStack } = trpc.stacks.addTranslation.useMutation({
        onSuccess: ({ id }) => {
            utils.stacks.getSingle.refetch({ id })

            if (onSuccess) {
                onSuccess(id)
                return
            }

            onClose()
        },
    })

    const { mutate: addReact } = trpc.translations.addReaction.useMutation({
        onSuccess: () => {
            utils.translations.getUserTranslations.invalidate()

            if (onSuccess) {
                onSuccess()
                return
            }

            onClose()
        },
        onError: () => {
            if (onSuccess) {
                onSuccess()
                return
            }

            onClose()
        },
    })

    const onSelect = useCallback(
        (stackId: number) => {
            addTranslationToStack({
                stackId,
                translationId,
            })
        },
        [addTranslationToStack, translationId]
    )

    return (
        <StackSelect
            title={title || "Добавить в коллекцию"}
            filter={"created"}
            canCreateNewStack={true}
            onClose={onClose}
            onSelect={onSelect}
            onFavorite={() => addReact({ translationId })}
        />
    )
}
