import { getInput } from '../utils/getInput'
import { range } from '../utils'

const input = getInput(__dirname)

const directions = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
}

type Direction = keyof typeof directions

type Position = [number, number]

const stepSneck = (
  [headX, headY]: Position,
  [stepDx, stepDy]: Position
): Position => [headX + stepDx, headY + stepDy]

const move = ([headX, headY]: Position, [tailX, tailY]: Position): Position => {
  const dx = headX - tailX
  const dy = headY - tailY
  if (Math.abs(dx) > 1) {
    tailX += Math.sign(dx)
    if (Math.abs(dy) > 0) {
      tailY += Math.sign(dy)
    }
  } else if (Math.abs(dy) > 1) {
    tailY += Math.sign(dy)
    if (Math.abs(dx) > 0) {
      tailX += Math.sign(dx)
    }
  }
  return [tailX, tailY]
}

const moveSneck = (length: number): number => {
  const data = input.split('\n').map(s => {
    const [direction, steps] = s.split(' ')
    return {
      direction: direction as Direction,
      steps: +steps,
    }
  })
  const sneck: Position[] = range(length, _ => [0, 0])
  const res = data.reduce(
    (acc, { direction, steps }) => {
      for (let _ = 0; _ < steps; _++) {
        acc.sneck[0] = stepSneck(
          acc.sneck[0],
          directions[direction] as Position
        )
        for (let i = 0; i < acc.sneck.length - 1; i++) {
          const tail = move(acc.sneck[i], acc.sneck[i + 1])
          acc.sneck[i + 1] = tail
          if (i + 2 === acc.sneck.length) {
            acc.tail.push(tail)
          }
        }
      }
      return acc
    },
    { sneck, tail: [] as Position[] }
  )
  return new Set(res.tail.map(pos => pos.toString())).size
}

export const part1 = () => moveSneck(2)

export const part2 = () => moveSneck(10)
