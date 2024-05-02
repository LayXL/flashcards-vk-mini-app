import { Button, Div } from "@vkontakte/vkui"
import { motion, useAnimationControls } from "framer-motion"
import { useModalState } from "../../../shared/hooks/useModalState"
import { CreateContent } from "../../../widgets/create-content"

export const CreateTranslationsStory = () => {
    const controls = useAnimationControls()

    const createModal = useModalState()

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
                        src={"/stories/duck_on_cards.webp"}
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
                                Создавай&nbsp;свои карточки
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
                                Добавляй новые переводы в&nbsp;приложение для&nbsp;их изучения
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
                                onClick={createModal.open}
                                className={"!bg-white !text-[#0077FF] z-50"}
                                children={"К созданию"}
                                stretched
                                size={"l"}
                            />
                        </motion.div>
                    </Div>
                </div>
            </div>

            <CreateContent {...createModal} />
        </>
    )
}
