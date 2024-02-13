import { appRouter } from "./appRouter"
import { t } from "./trpc"

const caller = t.createCallerFactory(appRouter)({
    vkId: 1,
})

const cb = () => {
    return caller.translations.create({
        vernacular: "Заселение",
        foreign: "Check in",
        languageId: 1,
        transcriptions: [
            {
                transcription: "|ˈtʃekɪn|",
            },
        ],
        tags: ["туризм"],
    })
}

cb().then((data) => {
    console.log(data)
})
