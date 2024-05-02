import { Caption, ConfigProvider, ModalPageHeader, PanelHeaderClose } from "@vkontakte/vkui"
import { ReactNode } from "react"
import { ModalBody } from "../../../features/modal/ui/modal-body"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { trpc } from "../../../shared/api"
import { cn } from "../../../shared/helpers/cn"
import { useModalState } from "../../../shared/hooks/useModalState"

type StoryCardProps = {
    id: number
    title: string
    content: ReactNode
    previewUrl: string
    isViewed?: boolean
}

export const StoryCard = ({ id, title, content, previewUrl, isViewed }: StoryCardProps) => {
    const storyViewModal = useModalState(false)

    const utils = trpc.useUtils()

    const { mutate } = trpc.stories.viewStory.useMutation({
        onSuccess: () => utils.stories.getAvailableStories.invalidate(),
    })

    return (
        <>
            <div
                onClick={() => {
                    storyViewModal.open()
                    if (!isViewed) mutate({ id })
                }}
                className={cn(
                    "rounded-xl p-[2px] bg-vk-accent size-24 box-border cursor-pointer",
                    isViewed && "bg-[#818C99]"
                )}
            >
                <div className={"p-[2px] bg-vk-content rounded-[10px] box-border w-full h-full"}>
                    <div
                        className={
                            "w-full h-full rounded-xl flex items-end text-white p-1 box-border"
                        }
                        style={{
                            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.5) 100%), url(${previewUrl}) lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <Caption children={title} level={"2"} />
                    </div>
                </div>
            </div>
            <ModalWrapper {...storyViewModal}>
                <ModalBody fullscreen>
                    <div className={"w-full h-full bg-black"} onClick={(e) => e.stopPropagation()}>
                        <div
                            className={
                                "rounded-xl h-full overflow-hidden relative [&>*]:h-full maxmx-auto select-none"
                            }
                        >
                            {content}
                            <div
                                className={cn(
                                    "absolute inset-0 pt-safe-area-top pointer-events-none"
                                    // "bg-[linear-gradient(to_bottom,rgba(0,0,0,.3),rgba(0,0,0,0)_20%)]"
                                )}
                            >
                                <div className={"pointer-events-auto"}>
                                    <ModalPageHeader
                                        noSeparator
                                        after={
                                            <ConfigProvider platform={"android"}>
                                                <PanelHeaderClose onClick={storyViewModal.close} />
                                            </ConfigProvider>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className={"pb-safe-area-bottom"}> */}
                        {/* <IconButton children={<Icon28Like />} /> */}
                        {/* </div> */}
                    </div>
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
