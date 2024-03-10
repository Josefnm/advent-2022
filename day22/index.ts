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

const DirSymbol = {
  [Directions.UP.toString()]: '^',
  [Directions.DOWN.toString()]: 'v',
  [Directions.LEFT.toString()]: '<',
  [Directions.RIGHT.toString()]: '>',
}
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
  if (turn === 'O') {
    return [-x, -y]
  }
  throw Error('bad turn')
}

const printGrid = (grid: Grid, [x, y]: Point, dir: Direction) => {
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

const findInitX = (grid: Grid) => {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][0] !== ' ') {
      return i
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
  const posX = findInitX(grid)
  let pos: Point = [posX, 0]
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

const findCorner = (grid: Grid, [x, y]: Point) => {
  if (grid[x + 1]?.[y] === ' ') {
    return [x + 1, y]
  }
  if (grid[x - 1]?.[y] === ' ') {
    return [x - 1, y]
  }
  if (grid[x][y + 1] === ' ') {
    return [x, y + 1]
  }
  if (grid[x][y - 1] === ' ') {
    return [x, y - 1]
  }
}

class Node {
  point
  pointType
  UP: Node | undefined
  DOWN: Node | undefined
  LEFT: Node | undefined
  RIGHT: Node | undefined
  constructor(point: Point, type: GridPoint) {
    this.point = point
    this.pointType = type
  }
  getNode(dir: Direction): Node | undefined {
    if (dir.toString() === Directions.UP.toString()) {
      return this.UP
    }
    if (dir.toString() === Directions.DOWN.toString()) {
      return this.DOWN
    }
    if (dir.toString() === Directions.LEFT.toString()) {
      return this.LEFT
    }
    if (dir.toString() === Directions.RIGHT.toString()) {
      return this.RIGHT
    }
  }
  setNode(dir: Direction, node: Node) {
    if (dir.toString() === Directions.UP.toString()) {
      this.UP = node
    }
    if (dir.toString() === Directions.DOWN.toString()) {
      this.DOWN = node
    }
    if (dir.toString() === Directions.LEFT.toString()) {
      this.LEFT = node
    }
    if (dir.toString() === Directions.RIGHT.toString()) {
      this.RIGHT = node
    }
  }
  toString() {
    return {
      point: this.point,
      pointType: this.pointType,
      left: this.LEFT?.point,
      right: this.RIGHT?.point,
      up: this.UP?.point,
      down: this.DOWN?.point,
    }
  }
}

type NodeGrid = Node[][]

const printNodeGrid = (grid: NodeGrid) => {
  for (let i = 0; i < grid[0].length; i++) {
    let str = ''
    for (let j = 0; j < grid.length; j++) {
      str += grid[j][i].pointType
    }
    console.log(str)
  }
}

const findStartNode = (grid: NodeGrid): Node => {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][0].pointType !== ' ') {
      return grid[i][0]!
    }
  }
  throw Error('no start')
}

const zipNodes = (start: Node,inputGrid:Grid) => {
  let direction = Directions.RIGHT
  let current = start
  let count = 0
  while (count < 100) {
    console.log('start', current.point, direction)
    printGrid(inputGrid, current.point, direction)
    count++
    const prev = current
    const next = current.getNode(direction)
    if (next?.pointType === ' ' || next === undefined) {
      direction = transformDirection(direction, 'R')
      current = current.getNode(direction)!
      console.log('turn right')
      continue
    }
    const leftDir = transformDirection(direction, 'L')
    const left = current.getNode(leftDir)
    const leftLeftDir = transformDirection(leftDir, 'L')
    const leftLeft = left?.getNode(leftLeftDir)
    if (left != null && left.pointType !== ' ' && leftLeft?.pointType === ' ') {
      console.log('fold corner', leftDir, left.toString())
      prev.setNode(leftDir, leftLeft)
      leftLeft.setNode(leftLeftDir, prev)
      direction = leftDir
      current = left
      continue
    }
    console.log('keep going straight')
    current = next
    // direction = direction
  }
  console.log('end', count)
}

/*
x
xo
xxx
 */

export const part2 = () => {
  const data = input.split('\n')
  const commands = data.pop()!.match(/\d+|\D+/g)!

  data.pop()
  const grid = createGrid(data)

  const nodeGrid = grid.map((x, xIdx) =>
    x.map((y, yIdx) => new Node([xIdx, yIdx], y)),
  )

  for (let i = 0; i < nodeGrid.length; i++) {
    for (let j = 0; j < nodeGrid[0].length; j++) {
      const node = nodeGrid[i][j]
      if (node.pointType !== ' ') {
        node.UP = nodeGrid[i]?.[j - 1]
        node.DOWN = nodeGrid[i]?.[j + 1]
        node.LEFT = nodeGrid[i - 1]?.[j]
        node.RIGHT = nodeGrid[i + 1]?.[j]
      }
    }
  }
  const startNode = findStartNode(nodeGrid)
  zipNodes(startNode,grid)
  printNodeGrid(nodeGrid)
  console.log(nodeGrid[nodeGrid.length-1][nodeGrid[0].length-1].toString())
  console.log(nodeGrid[nodeGrid.length-1][nodeGrid[0].length-1].toString())
  const dim = findDimension(grid)
  return dim
}
