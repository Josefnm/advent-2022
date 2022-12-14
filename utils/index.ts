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

export const range = <T = number>(
  length: number,
  mapper: (n: number) => T = n => n as T,
  startAt = 0
): T[] => [...Array(length).keys()].map(n => mapper(n + startAt))

export const getCharValue = (s: string) => {
  const char = s.charCodeAt(0)
  return char < 96 ? char - 38 : char - 96
}

export const toWindows = <T>(inputArray: T[], size: number): T[][] =>
  Array.from({ length: inputArray.length - (size - 1) }, (_, index) =>
    inputArray.slice(index, index + size)
  )
