import getInput from '../utils/getInput'

const input = getInput(__dirname)

type Point = [number, number]

type Direction = '>' | '<' | '^' | 'v'
type GridPoint = '.' | Direction
type Grid = GridPoint[][]

type Position = {
  point: Point
  turn: number
}

const createGrid = (data: string[]) => {
  const gridInput = data.map(s => s.split('')) as Grid
  const xAxis = data.sort((a, b) => b.length - a.length)[0].length
  const yAxis = data.length
  const grid: Grid = []
  for (let x = 0; x < xAxis - 2; x++) {
    grid[x] = []
    for (let y = 0; y < yAxis - 2; y++) {
      grid[x][y] = gridInput[y + 1][x + 1]
    }
  }
  return grid
}

const run = (grid: Grid, target: Point, init: Position) => {
  const visited = new Set<string>()
  const queue: Position[] = [init]
  const xAxis = grid.length
  const yAxis = grid[0].length
  while (queue.length) {
    const { point, turn: _turn } = queue.shift()!
    const turn = _turn + 1
    const stringPoint = point.toString() + turn
    if (visited.has(stringPoint)) {
      continue
    }
    visited.add(stringPoint)
    const [x, y] = point
    if (x === target[0] && y === target[1]) {
      return _turn
    }

    const validPoint = ([x, y]: Point) => {
      const right = grid[(x - (turn % xAxis) + xAxis) % xAxis]?.[y] === '>'
      const left = grid[(x + (turn % xAxis) + xAxis) % xAxis]?.[y] === '<'

      const up = grid[x]?.[(y + (turn % yAxis) + yAxis) % yAxis] === '^'
      const down = grid[x]?.[(y - (turn % yAxis) + yAxis) % yAxis] === 'v'

      const inside = x >= 0 && x < xAxis && y >= 0 && y < yAxis
      const isStart = x === 0 && y === -1
      const isEnd = x === target[0] && y === target[1]
      const noWind = !down && !up && !left && !right
      return noWind && (inside || isStart || isEnd)
    }
    const up: Point = [x, y - 1]
    const down: Point = [x, y + 1]
    const left: Point = [x - 1, y]
    const right: Point = [x + 1, y]
    for (const dir of [point, up, down, left, right]) {
      if (validPoint(dir)) {
        queue.push({ point: dir, turn })
      }
    }
  }
  throw Error('No path found')
}

export const part1 = () => {
  const data = input.split('\n')
  const grid = createGrid(data)
  const start: Point = [0, -1]
  const end: Point = [grid.length - 1, grid[0].length]

  const result = run(grid, end, { point: start, turn: 0 })
  return result
}

export const part2 = () => {
  const data = input.split('\n')
  const grid = createGrid(data)
  const start: Point = [0, -1]
  const end: Point = [grid.length - 1, grid[0].length]
  const result1 = run(grid, end, { point: start, turn: 0 })
  const result2 = run(grid, start, { point: end, turn: result1 })
  const result3 = run(grid, end, { point: start, turn: result2 })
  return result3
}
