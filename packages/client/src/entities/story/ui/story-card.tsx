import { ModalPageHeader, PanelHeaderClose, Subhead } from "@vkontakte/vkui"
import { ReactNode } from "react"
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
                    "rounded-2xl border-solid border-2 p-2 border-vk-accent size-32 box-border flex items-end text-white cursor-pointer",
                    isViewed && "border-[#818C99]"
                )}
                style={{
                    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.5) 100%), url(${previewUrl}) lightgray 50% / cover no-repeat`,
                }}
            >
                <Subhead children={title} />
            </div>
            <ModalWrapper {...storyViewModal}>
                <div className={"w-full h-full bg-black"} onClick={(e) => e.stopPropagation()}>
                    <div
                        className={
                            "rounded-xl h-full overflow-hidden relative [&>*]:h-full max-w-[480px] mx-auto select-none"
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
                                    before={<PanelHeaderClose onClick={storyViewModal.close} />}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"pb-safe-area-bottom"}>
                        {/* <IconButton children={<Icon28Like />} /> */}
                    </div>
                </div>
            </ModalWrapper>
        </>
    )
}
