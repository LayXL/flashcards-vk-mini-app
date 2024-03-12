import alternationTemplate from "../../../assets/backgrounds/alternation.svg?react"
import archTemplate from "../../../assets/backgrounds/arch.svg?react"
import boomTemplate from "../../../assets/backgrounds/boom.svg?react"
import branchesTemplate from "../../../assets/backgrounds/branches.svg?react"
import circleTemplate from "../../../assets/backgrounds/circle.svg?react"
import circlesTemplate from "../../../assets/backgrounds/circles.svg?react"
import handwritingTemplate from "../../../assets/backgrounds/handwriting.svg?react"
import leafTemplate from "../../../assets/backgrounds/leaf.svg?react"
import linesTemplate from "../../../assets/backgrounds/lines.svg?react"
import solidTemplate from "../../../assets/backgrounds/solid.svg?react"
import squaresTemplate from "../../../assets/backgrounds/squares.svg?react"
import trianglesTemplate from "../../../assets/backgrounds/triangles.svg?react"
import wavyTemplate from "../../../assets/backgrounds/wavy.svg?react"
import { decodeStackBackground } from "../../../shared/helpers/stackBackground"

const templates = {
    solid: solidTemplate,
    alternation: alternationTemplate,
    arch: archTemplate,
    boom: boomTemplate,
    branches: branchesTemplate,
    circle: circleTemplate,
    circles: circlesTemplate,
    handwriting: handwritingTemplate,
    leaf: leafTemplate,
    lines: linesTemplate,
    squares: squaresTemplate,
    triangles: trianglesTemplate,
    wavy: wavyTemplate,
}

export type Pattern =
    | "solid"
    | "alternation"
    | "arch"
    | "boom"
    | "branches"
    | "circle"
    | "circles"
    | "handwriting"
    | "leaf"
    | "lines"
    | "squares"
    | "triangles"
    | "wavy"

type StackBackgroundProps = {
    pattern?: string | null
    primaryColor?: string | null
    secondaryColor?: string | null
    encodedBackground?: string
    imageUrl?: string
}

export const StackBackground = ({
    pattern,
    primaryColor,
    secondaryColor,
    encodedBackground,
    imageUrl,
}: StackBackgroundProps) => {
    if (imageUrl) {
        return <img src={imageUrl} className="w-full h-full object-cover" />
    }

    if (encodedBackground) {
        const stackBackground = decodeStackBackground(encodedBackground)

        console.log(stackBackground)

        const Template = templates[stackBackground?.pattern as Pattern]

        return (
            <Template
                width={"none"}
                height={"none"}
                preserveAspectRatio={"xMidYMid slice"}
                className="w-full h-full"
                style={{
                    "--bg": stackBackground?.primaryColor,
                    "--bg-secondary": stackBackground?.secondaryColor,
                }}
            />
        )
    }

    if (!pattern) {
        return null
    }

    const Template = templates[pattern as Pattern]

    return (
        <Template
            width={"none"}
            height={"none"}
            preserveAspectRatio={"xMidYMid slice"}
            className="w-full h-full"
            style={{
                "--bg": primaryColor,
                "--bg-secondary": secondaryColor,
            }}
        />
    )
}
