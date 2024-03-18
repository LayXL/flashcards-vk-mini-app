export const getUserProgress = (totalXp: number) => {
    const multiplier = 10
    const currentLevel = Math.floor(totalXp / multiplier) + 1

    return {
        currentLevel,
        currentXp: totalXp - (currentLevel - 1) * multiplier,
        nextLevelXp: (currentLevel + 1) * multiplier,
        nextLevel: currentLevel + 1,
        totalXp,
        isMaxLevel: totalXp >= 1000,
    }
}
