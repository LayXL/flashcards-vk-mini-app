import { ModalPageHeader } from "@vkontakte/vkui"

type AddTranslationToStackProps = {
    translationId: number
}

export const AddTranslationToStack = ({ translationId }: AddTranslationToStackProps) => {
    return (
        <>
            <ModalPageHeader children={"Куда вы хотите сохранить?"} />

            <div>{translationId}</div>
        </>
    )
}
