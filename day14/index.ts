import { getInput } from '../utils/getInput'
import { toWindows } from '../utils'

const input = getInput(__dirname)

const SAND = 'o'
const ROCK = '#'
const AIR = '.'

const entry: Point = [0, 500]

type Shape = typeof SAND | typeof ROCK | typeof AIR

type Cave = Shape[][]

type Point = [number, number]

const createEmptyCave = () => {
  const grid: Cave = []
  for (let i = 0; i < 500; i++) {
    grid[i] = []
    for (let j = 0; j < 1000; j++) {
      grid[i][j] = '.'
    }
  }
  return grid
}

const constructCave = () => {
  const cave: Cave = createEmptyCave()

  let maxY = Number.MIN_VALUE
  input
    .split('\n')
    .map(s => s.split(' -> ').map(p => p.split(',').map(s => +s) as Point))
    .forEach(line => {
      toWindows(line, 2).forEach(([[x1, y1], [x2, y2]]) => {
        const fromX = Math.min(x1, x2)
        const toX = Math.max(x1, x2)
        const fromY = Math.min(y1, y2)
        const toY = Math.max(y1, y2)

        maxY = Math.max(maxY, toY)
        for (let y = fromY; y <= toY; y++) {
          for (let x = fromX; x <= toX; x++) {
            cave[y][x] = ROCK
          }
        }
      })
    })
  return { cave, maxY }
}

const fillSand = (cave: Cave) => {
  const enterSand = ([y, x]: Point): boolean => {
    if (cave[y][x] === AIR) {
      if (cave[y + 1]?.[x] === AIR) {
        return enterSand([y + 1, x])
      } else if (cave[y + 1]?.[x - 1] === AIR) {
        return enterSand([y + 1, x - 1])
      } else if (cave[y + 1]?.[x + 1] === AIR) {
        return enterSand([y + 1, x + 1])
      } else if (cave[y + 1]?.[x] !== undefined) {
        cave[y][x] = SAND
        return true
      }
    }
    return false
  }
  while (enterSand(entry)) {}
  return cave
}

const countSand = (acc: number, cur: Shape[]) =>
  acc + cur.reduce((_acc, _cur) => _acc + (_cur === SAND ? 1 : 0), 0)

export const part1 = () => fillSand(constructCave().cave).reduce(countSand, 0)

export const part2 = () => {
  const { cave, maxY } = constructCave()
  for (let i = 0; i < 1000; i++) {
    cave[maxY + 2][i] = ROCK
  }
  return fillSand(cave).reduce(countSand, 0)
}
