import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

type Instruction = [number, number, number]

type Mover = (stacks: string[][]) => ([amount, from, to]: Instruction) => void

const solver = (mover: Mover) => {
  const [stacksStr, instructionsStr] = input.split('\n\n')
  const stackRows = stacksStr
    .split('\n')
    .map(s => s.match(/( {4}|\w|\d+)/g) || [])

  const stackWidth = stackRows.pop()?.length || 0

  const stacks: string[][] = [...Array(stackWidth)].map(_ => [])

  stackRows.reverse().forEach(stack =>
    stack.forEach((item, idx) => {
      if (item.length === 1) {
        stacks[idx].push(item)
      }
    })
  )

  const instructions = instructionsStr
    .split('\n')
    .map(s => s.match(/\d+/g)?.map(s => +s) as Instruction)

  instructions.forEach(mover(stacks))
  return stacks.map(s => s.pop() ?? '').join()
}

export const part1 = () => {
  const mover: Mover =
    stacks =>
    ([amount, from, to]) => {
      for (let i = 0; i < amount; i++) {
        const letter = stacks[from - 1].pop()!
        stacks[to - 1].push(letter)
      }
    }
  return solver(mover)
}

export const part2 = () => {
  const mover: Mover =
    stacks =>
    ([amount, from, to]) => {
      const letters = stacks[from - 1].splice(-amount)
      const targetStack = stacks[to - 1]
      stacks[to - 1] = [...targetStack, ...letters]
    }
  return solver(mover)
}
