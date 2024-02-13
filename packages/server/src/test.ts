import { appRouter } from "./appRouter"
import { t } from "./trpc"

const caller = t.createCallerFactory(appRouter)({
    vkId: 1,
})

const cb = () => {
    return caller.test.similarity()
}

cb().then((data) => {
    console.log(data)
})
