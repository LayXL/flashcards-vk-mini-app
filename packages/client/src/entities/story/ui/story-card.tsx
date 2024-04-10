import { Caption, ModalPageHeader, PanelHeaderClose } from "@vkontakte/vkui"
import { ReactNode } from "react"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { cn } from "../../../shared/helpers/cn"
import { useModalState } from "../../../shared/hooks/useModalState"

type StoryCardProps = {
    title: string
    content: ReactNode
}

export const StoryCard = ({ title, content }: StoryCardProps) => {
    const storyViewModal = useModalState()

    return (
        <>
            <div className={"p-1 border-2 border-solid border-vk-accent rounded-md"}>
                <div
                    className={
                        "w-[90px] h-[106px] bg-vk-secondary rounded-[4px] p-1 box-border cursor-pointer flex flex-col justify-end"
                    }
                    onClick={() => storyViewModal.open()}
                >
                    <Caption weight={"2"} level={"2"} children={title} />
                </div>
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
                                "absolute inset-0 pt-safe-area-top pointer-events-none",
                                "bg-[linear-gradient(to_bottom,rgba(0,0,0,.3),rgba(0,0,0,0)_20%)]"
                            )}
                        >
                            <div className={"pointer-events-auto"}>
                                <ModalPageHeader
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
