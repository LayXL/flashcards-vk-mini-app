import { Subhead } from "@vkontakte/vkui"
import styled from "styled-components"

type LargeStackCardProps = {
    title: string
}

export const LargeStackCard = ({ title }: LargeStackCardProps) => {
    return (
        <Wrapper>
            <Card>
                <Background>
                    <Image src={"https://i.imgur.com/AErRDzr.png"} />
                    <Blur />
                    <MaskImage src={"https://i.imgur.com/AErRDzr.png"} />
                </Background>
                <Content>
                    <TitleWrapper>
                        <Title children={title} />
                    </TitleWrapper>
                </Content>
            </Card>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Card = styled.div`
    height: 198px;
    width: 170px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
`

const Background = styled.div`
    position: absolute;
    inset: 0;
`

const Blur = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(12px);
`

const Image = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const MaskImage = styled(Image)`
    mask-image: linear-gradient(180deg, #fff 70%, rgba(255, 255, 255, 0) 30%);
`

const Content = styled.div`
    display: flex;
    position: absolute;
    inset: 0;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 4px;
    padding: 12px;
`

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const Title = styled(Subhead).attrs({ weight: "1" })`
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
`
