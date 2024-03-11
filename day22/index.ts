import getInput from '../utils/getInput'

const input = getInput(__dirname)

type GridPoint = '.' | '#' | ' '
type Grid = GridPoint[][]

type Point = [number, number]
type Direction = [number, number]

const Directions = {
  DOWN: [0, 1],
  UP: [0, -1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
} satisfies Record<string, Direction>

const DirValue = {
  [Directions.UP.toString()]: 3,
  [Directions.DOWN.toString()]: 1,
  [Directions.LEFT.toString()]: 2,
  [Directions.RIGHT.toString()]: 0,
}

type Turn = 'L' | 'R' | 'O'

const transformDirection = (dir: Direction, turn: Turn): Direction => {
  const [x, y] = dir
  if (turn === 'R') {
    return [-y, x]
  }
  if (turn === 'L') {
    return [y, -x]
  }
  throw Error('bad turn')
}

const printGrid = (grid: Grid, [x, y]: Point, dir: Direction) => {
  const DirSymbol = {
    [Directions.UP.toString()]: '^',
    [Directions.DOWN.toString()]: 'v',
    [Directions.LEFT.toString()]: '<',
    [Directions.RIGHT.toString()]: '>',
  }
  for (let i = 0; i < grid[0].length; i++) {
    let str = ''
    for (let j = 0; j < grid.length; j++) {
      if (x === j && y === i) {
        str += DirSymbol[dir.toString()]
      } else {
        str += grid[j][i]
      }
    }
    console.log(str)
  }
}

const createGrid = (data: string[]) => {
  const gridInput = data.map(s => s.split('')) as Grid
  const xAxis = data.sort((a, b) => b.length - a.length)[0].length
  const yAxis = data.length
  const grid: Grid = []
  for (let x = 0; x < xAxis; x++) {
    grid[x] = []
    for (let y = 0; y < yAxis; y++) {
      grid[x][y] = gridInput[y][x] || ' '
    }
  }
  return grid
}

const wrapAround = (grid: Grid, [dx, dy]: Direction, [x, y]: Point): Point => {
  if (dx < 0) {
    for (let i = grid.length - 1; i > x; i--) {
      try {
        if (grid[i][y] !== ' ') {
          return [i, y]
        }
      } catch (e) {
        console.log('error')
        printGrid(grid, [i, y], [dx, dy])
        throw e
      }
    }
  } else if (dx > 0) {
    for (let i = 0; i < grid.length; i++) {
      try {
        if (grid[i][y] !== ' ') {
          return [i, y]
        }
      } catch (e) {
        console.log('error', [i, y])
        printGrid(grid, [i, y], [dx, dy])
        throw e
      }
    }
  } else if (dy < 0) {
    for (let i = grid[0].length - 1; i > y; i--) {
      if (grid[x][i] !== ' ') {
        return [x, i]
      }
    }
  } else if (dy > 0) {
    for (let i = 0; i < grid.length; i++) {
      if (grid[x][i] !== ' ') {
        return [x, i]
      }
    }
  }
  return [dx, dy]
}

const move = (
  grid: Grid,
  [x, y]: Point,
  [dx, dy]: Direction,
  cmd: number,
): Point => {
  for (let i = 0; i < cmd; i++) {
    const nx = x + dx
    const ny = y + dy
    if (grid[nx]?.[ny] === '#') {
      return [x, y]
    }
    if (grid[nx]?.[ny] === '.') {
      x = nx
      y = ny
      continue
    }

    const [wx, wy] = wrapAround(grid, [dx, dy], [x, y])

    if (grid[wx]?.[wy] === '#') {
      return [x, y]
    } else {
      x = wx
      y = wy
    }
  }
  return [x, y]
}

const findInitPosition = (grid: Grid): Point => {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][0] !== ' ') {
      return [i, 0]
    }
  }
  throw Error('no start')
}

export const part1 = () => {
  const data = input.split('\n')
  const commands = data.pop()!.match(/\d+|\D+/g)!

  data.pop()
  const grid = createGrid(data)
  let dir = Directions.RIGHT
  const posX = findInitPosition(grid)
  let pos: Point = findInitPosition(grid)
  for (const cmd of commands) {
    const dirNum = parseInt(cmd)
    if (isNaN(dirNum)) {
      dir = transformDirection(dir, cmd as Turn)
    } else {
      pos = move(grid, pos, dir, dirNum)
    }
  }
  const row = pos[1] + 1
  const col = pos[0] + 1
  const dirValue = DirValue[dir.toString()]
  return row * 1000 + col * 4 + dirValue
}

const findDimension = (grid: Grid) => {
  let minLen = Number.MAX_VALUE
  for (let i = 0; i < grid.length; i++) {
    let len = 0
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] !== ' ') {
        len++
      }
    }
    if (minLen > len) {
      minLen = len
    }
  }
  for (let i = 0; i < grid[0].length; i++) {
    let len = 0
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] !== ' ') {
        len++
      }
    }
    if (minLen > len) {
      minLen = len
    }
  }
  return minLen
}

const Direction = {
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3,
}

const createSmallGrid = (grid: Grid, sideSize: number) => {
  const newGrid: Grid = []
  for (let i = 0; i < grid.length / sideSize; i++) {
    newGrid[i] = []
    for (let j = 0; j < grid[0].length / sideSize; j++) {
      newGrid[i][j] = grid[i * sideSize][j * sideSize] === ' ' ? ' ' : '.'
    }
  }
  return newGrid
}
// 1 0 0
// 0 1 0
// 0 0 1
// -1 0 0
// 0 -1 0
// 0 0 -1

type Node = {
  x: -1 | 0 | 1
  y: -1 | 0 | 1
  z: -1 | 0 | 1
  point: Point
}

export const part2 = () => {
  const data = input.split('\n')
  const commands = data.pop()!.match(/\d+|\D+/g)!

  data.pop()
  const grid = createGrid(data)
  const pos = findInitPosition(grid)
  const dim = findDimension(grid)
  const smallGrid = createSmallGrid(grid, dim)

  const firstNode: Node = {
    x: 0,
    y: 0,
    z: 1,
    point: [pos[0] / dim, pos[1] / dim],
  }

  const visited = new Set<string>()

  /*
  00X0
  XXX0
  00XX
                    [0, 0, 1]
                    [0, 1, 0]
  [x, x, x][x, x, x][x, x, -1]
                    [x, x, 0][x, x, x]
  Front:  ( 0,  1,  0)
  Back:   ( 0, -1,  0)
  Right:  ( 1,  0,  0)
  Left:   (-1,  0,  0)
  Top:    ( 0,  0,  1)
  Bottom: ( 0,  0, -1)
   */

  const traverseNodes = (node: Node, grid: Grid, count: number) => {
    const [x, y] = node.point
    if (visited.has(node.point.toString())) return
    if (count > 3) return
    console.log(node, count)
    visited.add(node.point.toString())
    const leftP: Point = [x - 1, y]
    const rightP: Point = [x + 1, y]
    const topP: Point = [x, y - 1]
    const bottomP: Point = [x, y + 1]

    const nodes = [rightP, bottomP, leftP, bottomP]

    nodes.forEach((p, i) => {
      const node: Node = {
        x: 0,
        y: 0,
        z: 0,
        point: p,
      }
      console.log(i, count, node)
      traverseNodes(node, grid, count + 1)
    })

    if (grid[leftP[0]]?.[leftP[1]] === '.') {
      const node: Node = {
        x: -1,
        y: 0,
        z: 0,
        point: leftP,
      }
      traverseNodes(node, grid, count + 1)
    }
    if (grid[rightP[0]]?.[rightP[1]] === '.') {
      const node: Node = {
        x: 1,
        y: 0,
        z: 0,
        point: rightP,
      }
      traverseNodes(node, grid, count + 1)
    }
    if (grid[topP[0]]?.[topP[1]] === '.') {
      const node: Node = {
        x: 0,
        y: -1,
        z: 0,
        point: topP,
      }
      traverseNodes(node, grid, count + 1)
    }
    if (grid[bottomP[0]]?.[bottomP[1]] === '.') {
      const node: Node = {
        x: 0,
        y: 1,
        z: 0,
        point: bottomP,
      }
      traverseNodes(node, grid, count + 1)
    }
  }
  traverseNodes(firstNode, smallGrid, 0)

  return dim
}
/*
00X0
XXX0
00XX
 */
