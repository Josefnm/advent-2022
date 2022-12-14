import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

type Pair = [Packets[], Packets[]]

type Packets = Packets[] | number

const parse = (str: string): Packets[] => JSON.parse(str)

const getNested = (p: Packets): Packets[] => {
  if (typeof p === 'number') return [p]
  if (p == null) return []
  return p
}

const compare = ([first, second]: Pair): boolean | undefined => {
  for (let i = 0; i < Math.max(first.length, second.length); i++) {
    const f = first[i]
    const s = second[i]
    if (f === undefined) return true
    if (s === undefined) return false
    if (typeof f === 'number' && typeof s === 'number') {
      if (f === s) continue
      return f < s
    }
    const comp = compare([getNested(f), getNested(s)])
    if (comp != null) return comp
  }
}

export const part1 = () =>
  input
    .split('\n\n')
    .map(s => s.split('\n').map(parse) as Pair)
    .map(compare)
    .map((n, i) => +!!n * (i + 1))
    .reduce((acc, cur) => acc + cur, 0)

export const part2 = () => {
  const divA = '[[2]]'
  const divB = '[[6]]'
  const data = [divA, divB, ...input.split('\n').filter(s => !!s)]
    .map(parse)
    .sort((a, b) => {
      const comp = compare([a, b])
      return comp ? -1 : 1
    })
    .map(s => JSON.stringify(s))
  const a = 1 + data.indexOf(divA)
  const b = 1 + data.indexOf(divB)
  return a * b
}
