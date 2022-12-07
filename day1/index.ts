import getInput from '../utils/getInput'

const input = getInput(__dirname)

export const getCalories = () =>
  input
    .split('\n\n')
    .map(s => s.split('\n').reduce((acc, cur) => acc + +cur, 0))
    .sort((a, b) => b - a)

export const part1 = () => getCalories()[0]

export const part2 = () =>
  getCalories()
    .slice(0, 3)
    .reduce((acc, next) => acc + next, 0)
