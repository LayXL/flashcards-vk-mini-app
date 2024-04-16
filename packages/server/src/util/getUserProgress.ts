const levels = [
    [1, 0],
    [2, 20],
    [3, 40],
    [4, 65],
    [5, 100],
    [6, 150],
    [7, 215],
    [8, 295],
    [9, 390],
    [10, 500],
    [11, 615],
    [12, 740],
    [13, 870],
    [14, 1005],
    [15, 1145],
    [16, 1295],
    [17, 1455],
    [18, 1625],
    [19, 1805],
    [20, 2000],
    [21, 2200],
    [22, 2400],
    [23, 2600],
    [24, 2800],
    [25, 3000],
]

export const getUserProgress = (totalXp: number) => {
    totalXp = isNaN(totalXp) ? 0 : totalXp

    const currentLevelData = [...levels].reverse().find(([, xp]) => totalXp >= xp)

    const currentLevel = currentLevelData ? currentLevelData[0] : 0
    const currentXP = currentLevelData ? currentLevelData[1] : 0

    return {
        currentLevel: currentLevel,
        currentXp: (totalXp ?? 0) - currentXP,
        nextLevelXp: levels.find(([level]) => level === currentLevel + 1)?.[1] ?? 0,
        nextLevel: currentLevel + 1,
        totalXp: totalXp ?? 0,
        isMaxLevel: currentLevel === 25,
    }
}
