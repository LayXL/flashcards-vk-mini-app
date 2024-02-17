import { Icon28AddSquareOutline } from "@vkontakte/icons"
import { Caption, Subhead, Tappable } from "@vkontakte/vkui"
import styled from "styled-components"
import { ModalBody } from "../../../features/modal/ui/modal-body"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { vkTheme } from "../../../shared/helpers/vkTheme"
import { useModalState } from "../../../shared/hooks/useModalState"
import { TranslationAddToStack } from "../../../widgets/translation-add-to-stack"
import { TranslationView } from "../../../widgets/translation-view"
import flags from "../../flag/lib/flags"
import { FlagIcon } from "../../flag/ui/flag-icon"

type SearchTranslationCardProps = {
    id: number
    foreign: string
    vernacular: string
    languageVariationsFlags: (keyof typeof flags)[]
}

export const SearchTranslationCard = ({
    id,
    foreign,
    vernacular,
    languageVariationsFlags,
}: SearchTranslationCardProps) => {
    const addToStack = useModalState()
    const viewTranslation = useModalState()

    return (
        <>
            <Tappable onClick={viewTranslation.open} hoverMode={"opacity"} activeMode={"opacity"}>
                <Wrapper>
                    <Header>
                        <Flags>
                            {languageVariationsFlags.map((flag) => (
                                <FlagIcon flag={flag} height={24} round={true} />
                            ))}
                        </Flags>

                        <Tappable
                            onClick={(e) => {
                                e.stopPropagation()
                                addToStack.open()
                            }}
                            activeMode={"opacity"}
                            hoverMode={"opacity"}
                        >
                            <Icon28AddSquareOutline color={vkTheme.colorAccentBlue.normal.value} />
                        </Tappable>
                    </Header>

                    <TextWrapper>
                        <Subhead children={foreign} weight={"2"} />
                        <Caption children={vernacular} weight="3" level="2" />
                    </TextWrapper>
                </Wrapper>
            </Tappable>

            <ModalWrapper isOpened={viewTranslation.isOpened} onClose={viewTranslation.close}>
                <TranslationView id={id} onClose={viewTranslation.close} />
            </ModalWrapper>

            <ModalWrapper isOpened={addToStack.isOpened} onClose={addToStack.close}>
                <ModalBody>
                    <TranslationAddToStack translationId={id} onClose={addToStack.close} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}

const Wrapper = styled.div`
    box-sizing: border-box;
    width: 160px;
    padding: 12px 9px 12px 12px;
    display: flex;
    border-radius: 12px;
    box-shadow:
        0px 2px 24px 0px rgba(0, 0, 0, 0.08),
        0px 0px 2px 0px rgba(0, 0, 0, 0.08);
    flex-direction: column;
    gap: 12px;
    background-color: ${vkTheme.colorBackgroundModal.normal.value};
`

const TextWrapper = styled.div`
    display: flex;
    gap: 4px;
    flex-direction: column;

    & > * {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 1lh;
    }
`

const Flags = styled.div`
    display: flex;

    & > *:first-child {
        z-index: 5;
    }

    & > *:nth-child(2) {
        z-index: 4;
    }

    & > *:nth-child(3) {
        z-index: 3;
    }

    & > *:nth-child(4) {
        z-index: 2;
    }

    & > *:nth-child(5) {
        z-index: 1;
    }

    & > *:not(:first-child) {
        margin-left: -4px;
    }

    & > * {
        border: solid 1px ${vkTheme.colorBackgroundModal.normal.value};
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`
