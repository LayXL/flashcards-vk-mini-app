import * as crypto from "crypto"

export const isValidSign = (searchOrParsedUrlQuery: string, secretKey: string) => {
    let sign
    const queryParams = []

    const processQueryParam = (key, value) => {
        if (typeof value === "string") {
            if (key === "sign") {
                sign = value
            } else if (key.startsWith("vk_")) {
                queryParams.push({ key, value })
            }
        }
    }

    if (typeof searchOrParsedUrlQuery === "string") {
        const formattedSearch = searchOrParsedUrlQuery.startsWith("?")
            ? searchOrParsedUrlQuery.slice(1)
            : searchOrParsedUrlQuery

        for (const param of formattedSearch.split("&")) {
            const [key, value] = param.split("=")
            processQueryParam(key, value)
        }
    } else {
        for (const key of Object.keys(searchOrParsedUrlQuery)) {
            const value = searchOrParsedUrlQuery[key]
            processQueryParam(key, value)
        }
    }

    if (!sign || queryParams.length === 0) return false

    const queryString = queryParams
        .sort((a, b) => a.key.localeCompare(b.key))
        .reduce((acc, { key, value }, idx) => {
            return acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`
        }, "")

    const paramsHash = crypto
        .createHmac("sha256", secretKey)
        .update(queryString)
        .digest()
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=$/, "")

    return paramsHash === sign
}

// export const isValidSign = (data: { sign: string, request_id: string, ts: number }): boolean => {
//     const [userId, hash] = data.sign.split(":")
//
//     const paramsEncoded = Object.entries({
//         app_id: 51744454,
//         request_id: data.request_id,
//         ts: data.ts,
//         user_id: 542239914
//     }).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")
//
//     const paramsHash = crypto
//         .createHmac("sha256", env.CLIENT_SECRET)
//         .update(paramsEncoded)
//         .digest()
//         .toString("base64")
//         .replace(/\+/g, "-")
//         .replace(/\//g, "_")
//         .replace(/=$/, "")
//
//     // console.log(env.CLIENT_SECRET)
//     console.log(paramsEncoded)
//     console.log(paramsHash)
//     console.log(hash)
//
//     return paramsHash === hash
// }
