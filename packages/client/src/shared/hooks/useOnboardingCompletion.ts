import { useMutation, useQuery } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import { getStorageValue } from "../helpers/getStorageValue"

export const useOnboardingCompletion = (key: string) => {
    const { data, refetch, isSuccess } = useQuery({
        queryKey: ["vkStorage", key + "onboarding"],
        queryFn: async () => (await getStorageValue(key + "onboarding")) === "true",
        staleTime: Infinity,
    })

    const { mutate: complete } = useMutation({
        mutationKey: ["vkStorage", key + "onboarding"],
        mutationFn: () =>
            bridge.send("VKWebAppStorageSet", {
                key: key + "onboarding",
                value: "true",
            }),
        onSuccess: () => refetch(),
    })

    return {
        isCompleted: isSuccess ? data : null,
        complete,
    }
}
