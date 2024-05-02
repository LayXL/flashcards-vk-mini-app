import { Button, Div } from "@vkontakte/vkui"
import { motion, useAnimationControls } from "framer-motion"

export const SubscribeToCommunityStory = () => {
    const controls = useAnimationControls()

    return (
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
                    src={"/stories/duck.png"}
                    className={"w-full h-full object-cover object-center"}
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
                            Вступай в&nbsp;сообщество
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
                            И узнавай о&nbsp;новых возможностях в&nbsp;приложении
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
                            className={"!bg-white !text-[#0077FF] z-50"}
                            children={"Подписаться"}
                            stretched
                            size={"l"}
                            href={"https://vk.com/learning_app"}
                            target={"_blank"}
                        />
                    </motion.div>
                </Div>
            </div>
        </div>
    )
}
