import { getInput } from '../utils/getInput'
import { range } from '../utils'

const input = getInput(__dirname)

const ops = {
  '+': (a: number, b: number) => a + b,
  '*': (a: number, b: number) => a * b,
}

const doOperation = (str: string, old: number): number => {
  const [a, b, c] = str.split(' ')
  const first = a === 'old' ? old : +a
  const second = c === 'old' ? old : +c
  return ops[b as keyof typeof ops](first, second)
}

const monkeyBizLvl = (divider: number, rounds: number) => {
  const monkeys = input.split('\n\n').map(s => {
    const [monkey, _items, _operation, _test, _ifTrue, _ifFalse] = s
      .trim()
      .split('\n')
    const items = (_items.match(/\d+/g) ?? []).map(s => +s)
    const operation = _operation.split(' = ')[1]
    const testDivider = +(_test.match(/\d+/)?.[0] ?? 0)

    const ifTrue = +(_ifTrue.match(/\d+/)?.[0] ?? 0)
    const ifFalse = +(_ifFalse.match(/\d+/)?.[0] ?? 0)

    return {
      items,
      operation,
      testDivider,
      getTarget: (item: number) =>
        item % testDivider === 0 ? ifTrue : ifFalse,
      inspected: 0,
    }
  })

  const commonDenominator = monkeys.reduce(
    (acc, cur) => acc * cur.testDivider,
    1
  )

  range(rounds).forEach(() =>
    monkeys.forEach((monkey, i) => {
      monkey.items.forEach(item => {
        const newItem = Math.floor(
          doOperation(monkey.operation, item) / divider
        )
        const targetMonkey = monkey.getTarget(newItem)
        monkeys[targetMonkey].items.push(newItem % commonDenominator)
      })
      monkey.inspected += monkey.items.length
      monkey.items = []
    })
  )

  const [m1, m2] = monkeys.map(monkey => monkey.inspected).sort((a, b) => b - a)
  return m1 * m2
}

export const part1 = () => monkeyBizLvl(3, 20)

export const part2 = () => monkeyBizLvl(1, 10_000)
