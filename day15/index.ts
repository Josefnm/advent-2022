import { getInput } from '../utils/getInput'
import { range } from '../utils'

const input = getInput(__dirname)

const row = 2000000

type Point = [number, number]
type Pair = {
  sensor: Point
  beacon: Point
  diff: number
}

const countCoverage = (
  { sensor: [sx, sy], beacon: [bx, by], diff }: Pair,
  lineY: number
): Point | null => {
  const coverage = Math.max(diff - Math.abs(lineY - sy) + 1, 0)
  if (coverage <= 0) return null
  return [sx - coverage + 1, sx + coverage - 1]
}

const parseInput = () =>
  input
    .split('\n')
    .map(s => s.match(/-(\d+)|(\d+)/g) ?? [])
    .map(
      ([sx, sy, bx, by]) =>
        ({
          sensor: [+sx, +sy],
          beacon: [+bx, +by],
          diff: Math.abs(+sx - +bx) + Math.abs(+sy - +by),
        } as Pair)
    )

export const part1 = () => {
  const data = parseInput()

  const bPoints = new Set(
    data
      .map(item => item.beacon)
      .filter(item => item[1] === row)
      .map(s => s.toString())
  )

  const test = (
    data.map(e => countCoverage(e, row)).filter(e => !!e) as Point[]
  )
    .map(([x1, x2]) => range(x2 - x1 + 1, x => x, x1))
    .flat()

  return new Set(test).size - bPoints.size
}

const min = 0
const max = 4_000_000

const findGap = (pairs: Point[]): false | number => {
  if (pairs.length === 1) {
    if (pairs[0][0] > 0 || pairs[0][1] < 4_000_000) {
      throw Error('unhandled behaviour')
    }
    return false
  }
  pairs.sort((a, b) => a[0] - b[0])
  let currEnd = pairs[0][1]
  for (let i = 1; i < pairs.length; i++) {
    const [start, end] = pairs[i]
    if (start <= currEnd || start < 0 || currEnd > max) {
      currEnd = Math.max(end, currEnd)
    } else {
      return currEnd + 1
    }
  }
  return false
}

export const part2 = () => {
  const data = parseInput()
  for (let i = min; i < 4_000_000; i++) {
    const tempRes: Point[] = []
    for (let j = 0; j < data.length; j++) {
      const coverage = countCoverage(data[j], i)
      if (coverage) {
        tempRes.push(coverage)
      }
    }
    const res = findGap(tempRes)
    if (res !== false) {
      return i + res * max
    }
  }
}
