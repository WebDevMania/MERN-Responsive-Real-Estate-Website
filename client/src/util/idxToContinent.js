export const arrContinent = [
    'europe',
    'asia',
    'africa',
    'south america',
    'north america',
    'oceania'
]

export const continentToIdx = (continent) => {
    return arrContinent.findIndex((cont) => cont.toLowerCase() === continent.toLowerCase())
}

export const idxToContinent = (idx) => {
    return (arrContinent.filter((_, index) => index === Number(idx)))[0]
}