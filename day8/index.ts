import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

const inputToGrid = () => input.split('\n').map(s => s.split('').map(s => +s))

const isAnyEdgeVisible = (i: number, j: number, grid: number[][]): boolean =>
  (() => {
    for (let k = 0; k < i; k++) {
      if (grid[k][j] >= grid[i][j]) return false
    }
    return true
  })() ||
  (() => {
    for (let k = i + 1; k < grid.length; k++) {
      if (grid[k][j] >= grid[i][j]) return false
    }
    return true
  })() ||
  (() => {
    for (let k = 0; k < j; k++) {
      if (grid[i][k] >= grid[i][j]) return false
    }
    return true
  })() ||
  (() => {
    for (let k = j + 1; k < grid[i].length; k++) {
      if (grid[i][k] >= grid[i][j]) return false
    }
    return true
  })()

export const part1 = () => {
  const grid = inputToGrid()
  let counter = 0
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i]
    for (let j = 0; j < row.length; j++) {
      if (
        i === 0 ||
        j === 0 ||
        i === grid.length - 1 ||
        j === row.length - 1 ||
        isAnyEdgeVisible(i, j, grid)
      ) {
        counter++
      }
    }
  }
  return counter
}

const countVisible = (i: number, j: number, grid: number[][]): number => {
  const height = grid[i][j]
  const visible = [0, 0, 0, 0]

  // top
  for (let k = i + -1; k >= 0; k--) {
    visible[0]++
    if (grid[k][j] >= height) {
      break
    }
  }
  // bottom
  for (let k = i + 1; k < grid.length; k++) {
    visible[1]++
    if (grid[k][j] >= height) {
      break
    }
  }
  // left
  for (let k = j + -1; k >= 0; k--) {
    visible[2]++
    if (grid[i][k] >= height) {
      break
    }
  }
  // right
  for (let k = j + 1; k < grid[i].length; k++) {
    visible[3]++
    if (grid[i][k] >= height) {
      break
    }
  }
  return visible.reduce((acc, cur) => acc * cur, 1)
}

export const part2 = () => {
  const grid = inputToGrid()
  const counter: number[] = []

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      counter.push(countVisible(i, j, grid))
    }
  }
  return counter.sort((a, b) => b - a)[0]
}
