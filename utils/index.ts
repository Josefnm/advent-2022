export const intersect = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b)
  return [...new Set(a)].filter(x => setB.has(x))
}

export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.reduce<T[][]>((acc, cur, idx) => {
    const chunkIndex = Math.floor(idx / size)
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []
    }
    acc[chunkIndex].push(cur)
    return acc
  }, [])

export const range = (length: number, startAt = 0) =>
  [...Array(length).keys()].map(n => n + startAt)
