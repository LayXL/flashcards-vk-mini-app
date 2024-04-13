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
    const currentLevel = [...levels].reverse().find(([, xp]) => totalXp >= xp)

    return {
        currentLevel: currentLevel[0],
        currentXp: totalXp - currentLevel[1],
        nextLevelXp: levels.find(([level]) => level === currentLevel[0] + 1)?.[1] ?? 0,
        nextLevel: currentLevel[0] + 1,
        totalXp,
        isMaxLevel: currentLevel[0] === 25,
    }
}
