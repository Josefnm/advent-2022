import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

const SHAPES = {
  A: 0,
  B: 1,
  C: 2,
  X: 0,
  Y: 1,
  Z: 2,
}

type Shape = keyof typeof SHAPES

const solver = (resultMapper: (round: [Shape, Shape]) => number) =>
  input
    .split('\n')
    .map(s => s.split(' ') as [Shape, Shape])
    .map(resultMapper)
    .reduce((acc, cur) => acc + cur, 0)

const calculateScore = (oppShape: number, yourShape: number) =>
  yourShape + 1 + ((yourShape + 4 - oppShape) % 3) * 3

export const part1 = () =>
  solver(([opponent, you]) => calculateScore(SHAPES[opponent], SHAPES[you]))

export const part2 = () =>
  solver(([opponent, you]) => {
    const responseShape = (SHAPES[opponent] + SHAPES[you] + 2) % 3
    return calculateScore(SHAPES[opponent], responseShape)
  })
