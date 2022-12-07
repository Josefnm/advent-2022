import { getInput } from '../utils/getInput'
import { chunkArray, intersect } from '../utils'

const input = getInput(__dirname)

const getCharValue = (s: string) => {
  const char = s.charCodeAt(0)
  return char < 96 ? char - 38 : char - 96
}

export const part1 = () =>
  input
    .split('\n')
    .map(sack => {
      const items = sack.split('')
      const mid = items.length / 2
      const left = items.slice(0, mid)
      const right = items.slice(mid)
      return intersect(left, right)[0]
    })
    .reduce((acc, cur) => acc + getCharValue(cur), 0)

export const part2 = () =>
  chunkArray(
    input.split('\n').map(s => s.split('')),
    3
  )
    .map(([a, b, c]) => intersect(intersect(a, b), c)[0])
    .reduce((acc, cur) => acc + getCharValue(cur), 0)
