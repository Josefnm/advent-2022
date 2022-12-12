import { getInput } from '../utils/getInput'
import { chunkArray } from '../utils'

const input = getInput(__dirname)

export const part1 = () =>
  input
    .split('\n')
    .map(s => (s === 'noop' ? 0 : [0, +s.split(' ')[1]]))
    .flat()
    .reduce(
      (acc, cur, i) => {
        acc.push((acc[i + 1] += cur))
        return acc
      },
      [1, 1]
    )
    .map((strength, idx) => strength * (idx + 1))
    .filter((_, i) => (i + 21) % 40 === 0)
    .reduce((acc, cur) => acc + cur)

export const part2 = () =>
  chunkArray(
    input
      .split('\n')
      .map(s => (s === 'noop' ? 0 : [0, +s.split(' ')[1]]))
      .flat()
      .reduce(
        (acc, cur, cycle) => {
          if (acc.x - 1 <= cycle % 40 && acc.x + 1 >= cycle % 40) {
            acc.crt.push('#')
          } else {
            acc.crt.push('.')
          }
          acc.x += cur
          return acc
        },
        {
          x: 1,
          crt: [] as string[],
        }
      ).crt,
    40
  ).map(s => s.join(''))
