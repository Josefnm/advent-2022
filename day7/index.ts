import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

type Files = { [Key: string]: number | Files }

const MAX_SIZE = 100000

const createFiles = () => {
  const currentDir: Files[] = [{}]
  for (const line of input.split('\n')) {
    if (line.includes('$ cd ..')) {
      currentDir.pop()
    } else if (line.includes('$ cd ')) {
      const dirName = line.slice(5)
      const dir = {}
      currentDir.at(-1)![dirName] = dir
      currentDir.push(dir)
    } else if (line.match(/\d+/)?.[0] != null) {
      const num = line.match(/\d+/)?.[0]!
      const name = line.slice(num.length + 1)
      currentDir.at(-1)![name] = +num
    }
  }
  return currentDir[0]
}

const traverseData = (file: Files): number[] => {
  let sum = 0
  let folders: number[] = []
  for (const [_, val] of Object.entries(file)) {
    if (typeof val === 'number') {
      sum += val
    } else {
      const res = traverseData(val)
      sum += res.at(-1) ?? 0
      folders = [...folders, ...res]
    }
  }
  return [...folders, sum]
}

export const part1 = () => {
  const data = createFiles()

  return traverseData(data)
    .filter(n => n <= MAX_SIZE)
    .reduce((acc, cur) => acc + cur, 0)
}

const TARGET_SIZE = 40000000

export const part2 = () => {
  const data = traverseData(createFiles())
  data.sort((a, b) => a - b)
  const currentSize = data.at(-1) ?? 0
  const spaceNeeded = currentSize - TARGET_SIZE
  return data.find(item => item > spaceNeeded)
}
