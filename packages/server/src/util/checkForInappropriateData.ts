const url =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

const russianSwearWords =
    /(?<![а-яё])(?:(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\S(?=[а-яё]))+?[оаеи-])-?)?(?:[её](?:б(?!о[рй]|рач)|п[уа](?:ц|тс))|и[пб][ае][тцд][ьъ]).*?|(?:(?:н[иеа]|ра[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч)-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|\S*?(?:п(?:[иеё]зд|ид[аое]?р|ед(?:р(?!о)|[аое]р|ик)|охую)|бля(?:[дбц]|тс)|[ое]ху[яйиеё]|хуйн).*?|(?:о[тб]?|про|на|вы)?м(?:анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й))|елд[ауые].*?|ля[тд]ь|(?:[нз]а|по)х)(?![а-яё])/

const englishSwearWords =
    /^[a@][s\$][s\$]$[a@][s\$][s\$]h[o0][l1][e3][s\$]?b[a@][s\$][t\+][a@]rd b[e3][a@][s\$][t\+][i1][a@]?[l1]([i1][t\+]y)?b[e3][a@][s\$][t\+][i1][l1][i1][t\+]yb[e3][s\$][t\+][i1][a@][l1]([i1][t\+]y)?b[i1][t\+]ch[s\$]?b[i1][t\+]ch[e3]r[s\$]?b[i1][t\+]ch[e3][s\$]b[i1][t\+]ch[i1]ng?b[l1][o0]wj[o0]b[s\$]?c[l1][i1][t\+]^(c|k|ck|q)[o0](c|k|ck|q)[s\$]?$(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[e3]d (c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[e3]r(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[i1]ng(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[s\$]^cum[s\$]?$cumm??[e3]rcumm?[i1]ngcock(c|k|ck|q)um[s\$]h[o0][t\+](c|k|ck|q)un[i1][l1][i1]ngu[s\$](c|k|ck|q)un[i1][l1][l1][i1]ngu[s\$](c|k|ck|q)unn[i1][l1][i1]ngu[s\$](c|k|ck|q)un[t\+][s\$]?(c|k|ck|q)un[t\+][l1][i1](c|k|ck|q)(c|k|ck|q)un[t\+][l1][i1](c|k|ck|q)[e3]r(c|k|ck|q)un[t\+][l1][i1](c|k|ck|q)[i1]ngcyb[e3]r(ph|f)u(c|k|ck|q)d[a@]mnd[i1]ckd[i1][l1]d[o0]d[i1][l1]d[o0][s\$]d[i1]n(c|k|ck|q)d[i1]n(c|k|ck|q)[s\$][e3]j[a@]cu[l1](ph|f)[a@]g[s\$]?(ph|f)[a@]gg[i1]ng(ph|f)[a@]gg?[o0][t\+][s\$]?(ph|f)[a@]gg[s\$](ph|f)[e3][l1][l1]?[a@][t\+][i1][o0](ph|f)u(c|k|ck|q)(ph|f)u(c|k|ck|q)[s\$]?g[a@]ngb[a@]ng[s\$]?g[a@]ngb[a@]ng[e3]dg[a@]yh[o0]m?m[o0]h[o0]rnyj[a@](c|k|ck|q)\-?[o0](ph|f)(ph|f)?j[e3]rk\-?[o0](ph|f)(ph|f)?j[i1][s\$z][s\$z]?m?[ck][o0]ndum[s\$]?mast(e|ur)b(8|ait|ate)n+[i1]+[gq]+[e3]*r+[s\$]*[o0]rg[a@][s\$][i1]m[s\$]?[o0]rg[a@][s\$]m[s\$]?p[e3]nn?[i1][s\$]p[i1][s\$][s\$]p[i1][s\$][s\$][o0](ph|f)(ph|f) p[o0]rnp[o0]rn[o0][s\$]?p[o0]rn[o0]gr[a@]phypr[i1]ck[s\$]?pu[s\$][s\$][i1][e3][s\$]pu[s\$][s\$]y[s\$]?[s\$][e3]x[s\$]h[i1][t\+][s\$]?[s\$][l1]u[t\+][s\$]?[s\$]mu[t\+][s\$]?[s\$]punk[s\$]?[t\+]w[a@][t\+][s\$]?/

const whitelist = ["ребро", "веб"]
const whitelistRegex = new RegExp(whitelist.join("|"), "gi")

export const checkForInappropriateData = (text: string) => {
    const transformedText = text.replace(/(\r\n|\n|\r)/gm, " ").replace(whitelistRegex, "")

    return (
        url.test(transformedText) ||
        russianSwearWords.test(transformedText) ||
        englishSwearWords.test(transformedText)
    )
}
