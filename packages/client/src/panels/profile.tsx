import {
    Button,
    CardScroll,
    Div,
    Group,
    Header,
    Link,
    ModalPageHeader,
    PanelHeader,
    PanelHeaderClose,
    Spacing,
    Tabs,
    TabsItem,
} from "@vkontakte/vkui"
import { useState } from "react"
import { LevelCard } from "../entities/level/ui/level-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { useModalState } from "../shared/hooks/useModalState"
import { TranslationsTable } from "../widgets/translations-table"
import { UserStacks } from "../widgets/user-stacks"
import { UserTranslations } from "../widgets/user-translations"

export const Profile = () => {
    const [tab, setTab] = useState("stacks")

    const { data } = trpc.getUser.useQuery()

    const translationsTableModal = useModalState()

    return (
        <>
            <PanelHeader children={"Профиль"} />

            <Group>
                {!data && <LevelCard />}

                {data && (
                    <LevelCard
                        avatarUrl={getSuitableAvatarUrl(data.avatarUrls, 64)}
                        name={data.fullName}
                        level={data.progress.currentLevel}
                        currentXp={data.progress.currentXp}
                        nextLevelXp={data.progress.nextLevelXp}
                    />
                )}
            </Group>

            <Group>
                <Div>
                    <Button
                        children={"Кнопка крутой лингвистки"}
                        stretched
                        size={"l"}
                        onClick={translationsTableModal.open}
                    />
                </Div>
            </Group>

            <Group>
                <Header children={"Достижения"} aside={<Link children={"Показать все"} />} />
                <CardScroll>
                    <div className={"flex gap-2.5"}>
                        <div
                            className={"w-[128px] h-[128px] bg-vk-secondary rounded-xl shadow-card"}
                        />
                        <div
                            className={"w-[128px] h-[128px] bg-vk-secondary rounded-xl shadow-card"}
                        />
                        <div
                            className={"w-[128px] h-[128px] bg-vk-secondary rounded-xl shadow-card"}
                        />
                        <div
                            className={"w-[128px] h-[128px] bg-vk-secondary rounded-xl shadow-card"}
                        />
                        <div
                            className={"w-[128px] h-[128px] bg-vk-secondary rounded-xl shadow-card"}
                        />
                    </div>
                </CardScroll>
            </Group>

            <Tabs>
                <TabsItem
                    onClick={() => setTab("stacks")}
                    selected={tab === "stacks"}
                    children={"Стопки"}
                />
                <TabsItem
                    onClick={() => setTab("translations")}
                    selected={tab === "translations"}
                    children={"Переводы"}
                />
            </Tabs>

            {tab === "stacks" && <UserStacks />}

            {tab === "translations" && <UserTranslations />}

            <Spacing size={256} />

            <TabBar />

            <ModalWrapper
                isOpened={translationsTableModal.isOpened}
                onClose={translationsTableModal.close}
            >
                <ModalBody fullwidth={true} fullscreen={true}>
                    <ModalPageHeader
                        children={"Таблица переводов"}
                        before={<PanelHeaderClose onClick={translationsTableModal.close} />}
                    />
                    <TranslationsTable />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
