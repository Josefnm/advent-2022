import getInput from '../utils/getInput'

const input = getInput(__dirname)

type GridPoint = '.' | '#' | ' '
type Grid = GridPoint[][]

type Point = [number, number]
type Direction = [number, number]

const Directions: Point[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

const DirValue = {
  [Directions[0].toString()]: 0,
  [Directions[1].toString()]: 1,
  [Directions[2].toString()]: 2,
  [Directions[3].toString()]: 3,
} as Record<string, Rotation>

type Turn = 'L' | 'R'

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

const move = (
  grid: Grid,
  [x, y]: Point,
  [dx, dy]: Direction,
  cmd: number,
  wrapFn: (
    [dx, dy]: Direction,
    [x, y]: Point,
  ) => {
    point: Point
    direction: Direction
  },
): {
  point: Point
  direction: Direction
} => {
  for (let i = 0; i < cmd; i++) {
    const nx = x + dx
    const ny = y + dy
    if (grid[nx]?.[ny] === '#') {
      return {
        point: [x, y],
        direction: [dx, dy],
      }
    }
    if (grid[nx]?.[ny] === '.') {
      x = nx
      y = ny
      continue
    }

    const {
      point: [wx, wy],
      direction,
    } = wrapFn([dx, dy], [x, y])

    if (grid[wx]?.[wy] === '#') {
      return {
        point: [x, y],
        direction: [dx, dy],
      }
    } else {
      x = wx
      y = wy
      dx = direction[0]
      dy = direction[1]
    }
  }
  return {
    point: [x, y],
    direction: [dx, dy],
  }
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
  let dir = Directions[0]

  let pos = findInitPosition(grid)

  const wrapAroundPart = (
    direction: Direction,
    [x, y]: Point,
  ): {
    point: Point
    direction: Direction
  } => {
    const [dx, dy] = direction
    if (dx < 0) {
      for (let i = grid.length - 1; i > x; i--) {
        if (grid[i][y] !== ' ') {
          return {
            point: [i, y],
            direction: [dx, dy],
          }
        }
      }
    } else if (dx > 0) {
      for (let i = 0; i < grid.length; i++) {
        if (grid[i][y] !== ' ') {
          return {
            point: [i, y],
            direction: [dx, dy],
          }
        }
      }
    } else if (dy < 0) {
      for (let i = grid[0].length - 1; i > y; i--) {
        if (grid[x][i] !== ' ') {
          return {
            point: [x, i],
            direction: [dx, dy],
          }
        }
      }
    } else if (dy > 0) {
      for (let i = 0; i < grid.length; i++) {
        if (grid[x][i] !== ' ') {
          return {
            point: [x, i],
            direction: [dx, dy],
          }
        }
      }
    }
    throw Error('no wrap')
  }
  for (const cmd of commands) {
    const dirNum = parseInt(cmd)
    if (isNaN(dirNum)) {
      dir = transformDirection(dir, cmd as Turn)
    } else {
      const { point } = move(grid, pos, dir, dirNum, wrapAroundPart)
      pos = point
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

type Rotation = 0 | 1 | 2 | 3
type Face = 1 | 2 | 3 | 4 | 5 | 6

type Edge = [Face, Rotation]

class FacingEdges {
  edges: [Edge, Edge]
  constructor(edges: [Edge, Edge]) {
    this.edges = edges
  }
  toString() {
    return `(${this.edges[0][0]}, ${this.edges[0][1]}) (${this.edges[1][0]}, ${this.edges[1][1]})`
  }
}

const diceEdges: FacingEdges[] = [
  new FacingEdges([
    [1, 2],
    [2, 0],
  ]),
  new FacingEdges([
    [1, 1],
    [3, 0],
  ]),
  new FacingEdges([
    [1, 3],
    [4, 0],
  ]),
  new FacingEdges([
    [1, 0],
    [5, 0],
  ]),
  new FacingEdges([
    [2, 1],
    [3, 3],
  ]),
  new FacingEdges([
    [2, 2],
    [6, 0],
  ]),
  new FacingEdges([
    [2, 3],
    [4, 1],
  ]),
  new FacingEdges([
    [3, 1],
    [5, 3],
  ]),
  new FacingEdges([
    [3, 2],
    [6, 1],
  ]),
  new FacingEdges([
    [4, 2],
    [6, 3],
  ]),
  new FacingEdges([
    [4, 3],
    [5, 1],
  ]),
  new FacingEdges([
    [5, 2],
    [6, 2],
  ]),
]

class Side {
  point: Point
  rotation: Rotation
  face: Face
  constructor(point: Point, face: Face, rotation: Rotation) {
    this.point = point
    this.face = face
    this.rotation = rotation
  }
  toString() {
    return `(${this.point[0]}, ${this.point[1]}), ${this.face}, ${this.rotation}`
  }
}

class Sides {
  sides: Side[] = []
  size: number
  constructor(size: number) {
    this.size = size
  }
  add(side: Side) {
    this.sides.push(side)
  }
  has(side: Side) {
    return !!this.sides.find(
      s => s.point[0] === side.point[0] && s.point[1] === side.point[1],
    )
  }
  findSide([x, y]: Point) {
    return this.sides.find(
      s =>
        s.point[0] === Math.floor(x / this.size) &&
        s.point[1] === Math.floor(y / this.size),
    )
  }
  findSideByFace(face: Face) {
    return this.sides.find(s => s.face === face)
  }
  toString() {
    return this.sides.map(s => s.toString()).join('\n')
  }
}

const findOppositeEdge = (edge: Edge): Edge => {
  const [face, rotation] = edge
  for (let diceEdge of diceEdges) {
    const [edge1, edge2] = diceEdge.edges
    if (edge1[0] === face && edge1[1] === rotation) {
      return diceEdge.edges[1]
    }
    if (edge2[0] === face && edge2[1] === rotation) {
      return diceEdge.edges[0]
    }
  }
  throw Error('bad edge')
}

const rotateAndMirrorPointInGrid = (
    [x, y]: Point,
    rotate: Rotation,
    size: number,
): Point => {
  const center = (size - 1) / 2

  const translatedX = x - center
  const translatedY = y - center

  let rotatedX
  let rotatedY
  switch (rotate) {
    case 0:
      rotatedX = translatedX
      rotatedY = translatedY
      break
    case 1:
      rotatedX = -translatedY
      rotatedY = translatedX
      break
    case 2:
      rotatedX = -translatedX
      rotatedY = -translatedY
      break
    case 3:
      rotatedX = translatedY
      rotatedY = -translatedX
      break
  }
  const resultX = rotatedX + center
  const resultY = rotatedY + center
  switch (rotate) {
    case 0:
    case 2:
      return [resultX, size - resultY - 1]
    case 1:
    case 3:
      return [size - resultX - 1, resultY]
  }
};

const getOppositeRotation = (rotation: Rotation): Rotation =>
  ((rotation + 2) % 4) as Rotation

export const part2 = () => {
  const data = input.split('\n')
  const commands = data.pop()!.match(/\d+|\D+/g)!

  data.pop()
  const largeGrid = createGrid(data)
  let pos = findInitPosition(largeGrid)
  const size = findDimension(largeGrid)
  const smallGrid = createSmallGrid(largeGrid, size)
  const firstSide: Side = new Side([pos[0] / size, pos[1] / size], 1, 0)

  const sides = new Sides(size)
  const directions: Rotation[] = [0, 1, 2, 3]

  const traverseSides = (side: Side, grid: Grid) => {
    const [x, y] = side.point
    directions.forEach(dir => {
      const [dx, dy] = Directions[dir]
      const nx = x + dx
      const ny = y + dy
      if (grid[nx]?.[ny] === '.') {
        const dxDir = ((dir + -side.rotation + 4) % 4) as Rotation
        const [face, oppRotation] = findOppositeEdge([side.face, dxDir])
        const oppDir = getOppositeRotation(dir)
        const newDir = ((oppDir - oppRotation + 4) % 4) as Rotation
        const newSide = new Side([nx, ny], face, newDir)
        if (sides.has(newSide)) return
        sides.add(newSide)
        traverseSides(newSide, grid)
      }
    })
  }
  sides.add(firstSide)
  traverseSides(firstSide, smallGrid)

  const wrapAround = (
    [dx, dy]: Direction,
    [x, y]: Point,
  ): { point: Point; direction: Point } => {
    const side = sides.findSide([x, y])!
    const dirNum = DirValue[[dx, dy].toString()]
    const rotation = ((dirNum - side.rotation + 4) % 4) as Rotation
    const edge = findOppositeEdge([side.face, rotation])

    const nextSide = sides.findSideByFace(edge[0])!
    const prevDirection = DirValue[[dx, dy].toString()]
    const nextRotation = nextSide.rotation
    const nextDirection = edge[1]
    const rotateBy = ((prevDirection + nextDirection + nextRotation) %
      4) as Rotation
    const [nx, ny] = rotateAndMirrorPointInGrid(
      [x % size, y % size],
      rotateBy,
      size,
    )
    return {
      direction:
        Directions[
          getOppositeRotation((nextDirection + nextRotation) as Rotation)
        ],
      point: [nextSide.point[0] * size + nx, nextSide.point[1] * size + ny],
    }
  }

  let dir = Directions[0]
  for (const cmd of commands) {
    const dirNum = parseInt(cmd)
    if (isNaN(dirNum)) {
      dir = transformDirection(dir, cmd as Turn)
    } else {
      const newPos = move(largeGrid, pos, dir, dirNum, wrapAround)
      dir = newPos.direction
      pos = newPos.point
    }
  }
  const row = pos[1] + 1
  const col = pos[0] + 1
  const dirValue = DirValue[dir.toString()]
  return row * 1000 + col * 4 + dirValue
}
