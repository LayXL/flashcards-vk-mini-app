import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import { Button, Div } from "@vkontakte/vkui"
import { motion, useAnimationControls } from "framer-motion"
import { ModalBody } from "../../../features/modal/ui/modal-body"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { trpc } from "../../../shared/api"
import { useModalState } from "../../../shared/hooks/useModalState"
import { GetAdditionalAttempt } from "../../../widgets/get-additional-attempt"
import { PlayRankedGame } from "../../../widgets/play-ranked-game"

export const PlayRatingStory = () => {
    const utils = trpc.useUtils()
    const controls = useAnimationControls()

    const { data: ratingAttemptsLeft, refetch } = trpc.game.getRatingAttemptsLeftToday.useQuery()
    const { data: hasAdditionalAttempt } = trpc.game.hasAdditionalAttempt.useQuery()

    const { mutate: getAdditionalAttempt } = trpc.game.getAdditionalAttempt.useMutation({
        onSuccess: () => {
            refetch()
            utils.game.hasAdditionalAttempt.setData(undefined, true)
        },
    })

    const ratingModal = useModalState()

    return (
        <>
            <div className={"bg-[#FF3B73] relative text-white"}>
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{ duration: 30, easings: ["easeInOut"] }}
                    className={"w-full h-full"}
                >
                    <motion.img
                        animate={controls}
                        initial={{ translateY: "100%" }}
                        src={"/stories/duck_in_cup.webp"}
                        className={"object-cover object-center w-full h-full"}
                        onLoad={() => {
                            controls.start({
                                translateY: "0%",
                                transition: {
                                    duration: 0.5,
                                    type: "spring",
                                    bounce: 0.15,
                                },
                            })
                        }}
                    />
                </motion.div>
                <div className={"flex flex-col font-vk-sans justify-between absolute inset-0"}>
                    <div>
                        <div
                            style={{
                                height: "var(--vkui_internal--panel_header_height)",
                            }}
                        />
                        <Div
                            className={"w-full py-9 box-border gap-4 flex-col flex"}
                            style={{
                                paddingLeft:
                                    "calc(var(--vkui--size_base_padding_vertical--regular) * 2)",
                            }}
                        >
                            <motion.p
                                transition={{
                                    delay: 0.3,
                                    duration: 0.5,
                                    type: "spring",
                                    bounce: 0.15,
                                }}
                                initial={{ translateX: "-100%" }}
                                animate={{ translateX: "0%" }}
                                className={"text-4xl font-bold"}
                            >
                                Испытай свои знания
                            </motion.p>
                            <motion.p
                                transition={{
                                    delay: 0.5,
                                    duration: 0.5,
                                    type: "spring",
                                    bounce: 0.15,
                                }}
                                initial={{ translateX: "-100%" }}
                                animate={{ translateX: "0%" }}
                                className={"text-xl font-medium"}
                            >
                                Получай баллы и&nbsp;поднимайся в&nbsp;таблице лидеров
                            </motion.p>
                        </Div>
                    </div>
                    <Div className={"mb-safe-area-bottom"}>
                        <motion.div
                            initial={{ translateY: "200%" }}
                            animate={{ translateY: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                onClick={ratingModal.open}
                                className={"!bg-white !text-[#0077FF] z-50"}
                                children={"Попробовать"}
                                stretched
                                size={"l"}
                            />
                        </motion.div>
                    </Div>
                </div>
            </div>

            <ModalWrapper {...ratingModal}>
                {ratingAttemptsLeft === 0 ? (
                    <GetAdditionalAttempt
                        isExtraEffort={!!hasAdditionalAttempt}
                        onClose={ratingModal.close}
                        onAction={() => {
                            bridge
                                .send("VKWebAppShowNativeAds", {
                                    ad_format: EAdsFormats.REWARD,
                                })
                                .then(() => {
                                    getAdditionalAttempt()
                                })
                        }}
                    />
                ) : (
                    <ModalBody>
                        <PlayRankedGame onClose={ratingModal.close} />
                    </ModalBody>
                )}
            </ModalWrapper>
        </>
    )
}
