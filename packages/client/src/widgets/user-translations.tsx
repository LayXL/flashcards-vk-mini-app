import { Icon24AddCircle, Icon24BookmarkOutline } from "@vkontakte/icons"
import {
    Avatar,
    Div,
    PanelSpinner,
    Spacing,
    SubnavigationBar,
    SubnavigationButton,
} from "@vkontakte/vkui"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationAdd } from "./translation-add"

export const UserTranslations = () => {
    const { data: userTranslations, isLoading } = trpc.translations.getUserTranslations.useQuery()

    const { data: userInfo } = trpc.getUser.useQuery()

    const addTranslationModal = useModalState()

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    before={<Icon24AddCircle />}
                    children={"Создать"}
                    onClick={addTranslationModal.open}
                />
                <SubnavigationButton before={<Icon24BookmarkOutline />} children={"Сохранённые"} />
                <SubnavigationButton
                    before={
                        <Avatar size={24} src={getSuitableAvatarUrl(userInfo?.avatarUrls, 32)} />
                    }
                    children={"Созданные мной"}
                />
            </SubnavigationBar>

            {isLoading && <PanelSpinner />}

            {userTranslations?.map((translation) => (
                <Div key={translation.id}>
                    <TranslationCard
                        id={translation.id}
                        vernacular={translation.vernacular}
                        foreign={translation.foreign}
                    />
                </Div>
            ))}

            <Spacing size={256} />

            <ModalWrapper
                isOpened={addTranslationModal.isOpened}
                onClose={addTranslationModal.close}
            >
                <ModalBody>
                    <TranslationAdd onClose={addTranslationModal.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
