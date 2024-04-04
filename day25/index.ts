import getInput from '../utils/getInput'

const input = getInput(__dirname)

const snafuToDecimalMap: Record<string, number> = {
  '=': -2,
  '-': -1,
  '0': 0,
  '1': 1,
  '2': 2,
}

const decimalToSnafuMap: Record<string, string> = {
  '-2': '=',
  '-1': '-',
  '0': '0',
  '1': '1',
  '2': '2',
}

const snafuToDecimal = (num: string) =>
  num
    .split('')
    .reverse()
    .map((x, i) => snafuToDecimalMap[x] * Math.pow(5, i))
    .reduce((a, b) => a + b, 0)

export const part1 = () => {
  const data = input.split('\n')

  const decimalSum = data.map(snafuToDecimal).reduce((a, b) => a + b, 0)

  let snafuSum = ''
  let carry = 0
  let remainingSum = decimalSum
  let i = 0
  while (remainingSum > 0) {
    const mod = Math.pow(5, i + 1)
    const rest = remainingSum % mod
    const sumAtPlace = (remainingSum % mod) / (mod / 5) + carry

    remainingSum -= rest
    carry = sumAtPlace <= 2 ? 0 : 1
    const sumWithoutCarry = sumAtPlace - carry * 5
    snafuSum = decimalToSnafuMap[sumWithoutCarry] + snafuSum

    i++
  }
  return snafuSum
}

export const part2 = () => {
  return "no puzzle for part 2"
}
