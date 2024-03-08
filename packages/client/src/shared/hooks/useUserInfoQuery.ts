import { useQuery } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"

export const useUserInfoQuery = () => {
    return useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            return await bridge.send("VKWebAppGetUserInfo", {
                user_id: 542239914,
            })
        },
    })
}
