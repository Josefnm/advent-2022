import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

const solver = (length: number): number => {
  const data = input.split('')
  for (let i = 0; i < data.length; i++) {
    if (new Set(data.slice(i, i + length)).size === length) {
      return i + length
    }
  }
  return -1
}

export const part1 = () => solver(4)

export const part2 = () => solver(14)
