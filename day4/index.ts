import { getInput } from '../utils/getInput'

export const input = getInput(__dirname)

type Section = [number, number]

const parsePair = (pair: string): Section[] =>
  pair.split(',').map(section => section.split('-').map(s => +s) as Section)

const solver = (comparator: (a: Section, b: Section) => boolean): number =>
  input
    .split('\n')
    .map(parsePair)
    .map(([a, b]) => comparator(a, b) || comparator(b, a))
    .reduce((acc, cur) => acc + +cur, 0)

const rangeContainsAll = (a: Section, b: Section) =>
  a[0] <= b[0] && a[1] >= b[1]

const rangeContainsFirst = (a: Section, b: Section) =>
  a[0] <= b[0] && a[1] >= b[0]

export const part1 = () => solver(rangeContainsAll)

export const part2 = () => solver(rangeContainsFirst)
