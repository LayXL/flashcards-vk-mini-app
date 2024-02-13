import { useSetRecoilState } from "recoil"
import { modalsHistory } from "../store"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"

export const useModalHistory = () => {
    const setModalHistory = useSetRecoilState(modalsHistory)
    const routeNavigator = useRouteNavigator()

    return {
        openModal: (modal: string) => {
            setModalHistory((prev) => [...prev, modal])
            routeNavigator.showModal(modal)
        },
        openPreviousModal: () => {
            setModalHistory((prev) => {
                const newModalHistory = [...prev]
                newModalHistory.pop()

                routeNavigator.showModal(newModalHistory[newModalHistory.length - 1])

                return newModalHistory
            })
        },
        close: () => {
            setModalHistory([])

            routeNavigator.hideModal()
        },
    }
}
