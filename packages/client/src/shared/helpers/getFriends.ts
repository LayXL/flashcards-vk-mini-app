import bridge from "@vkontakte/vk-bridge"

export const getFriends = (
    userId: number
): Promise<{ friends: number[]; hasAccessToFriends: boolean }> => {
    return new Promise((resolve, reject) => {
        bridge
            .send("VKWebAppGetAuthToken", {
                app_id: 51843841,
                scope: "friends",
            })
            .then((data) => {
                if (!data.access_token) return

                bridge
                    .send("VKWebAppCallAPIMethod", {
                        method: "friends.get",
                        params: {
                            user_id: parseInt(userId.toString()),
                            v: "5.131",
                            access_token: data.access_token,
                        },
                    })
                    .then((data) => {
                        if (!data.response?.items) return

                        resolve({
                            friends: data.response.items,
                            hasAccessToFriends: true,
                        })
                    })
                    .catch(() => reject({ friends: [], hasAccessToFriends: false }))
            })
            .catch(() => reject({ friends: [], hasAccessToFriends: false }))
    })
}
