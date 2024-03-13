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

function rotatePointInGrid([x, y]: Point, size: number, rotate: Rotation) {
  let center = 1.5

  // translate point to origin
  let translatedX = (x % size) - center
  let translatedY = (y % size) - center // Invert Y

  // rotate 90 degrees clockwise k times
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
    default:
      throw new Error('Rotation not defined. k should be in range 0 to 3')
  }
  // translate back
  let resultX = rotatedX + center
  let resultY = rotatedY + center // Revert Y inversion

  return [resultX, resultY]
}
let originalPoint = [3, 1] as Point
let rotatedPoint = rotatePointInGrid(originalPoint, 4, 1)
console.log(rotatedPoint)
/*
xxox
oxxx
xxxo
xoxx
 */

const DirValue = {
  [Directions[0].toString()]: 0,
  [Directions[1].toString()]: 1,
  [Directions[2].toString()]: 2,
  [Directions[3].toString()]: 3,
} as Record<string, Rotation>

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
    [Directions[0].toString()]: '>',
    [Directions[1].toString()]: 'v',
    [Directions[2].toString()]: '<',
    [Directions[3].toString()]: '^',
  }
  console.log('printing grid: ', x, y, dir.toString())
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
  let dir = Directions[0]

  let pos = findInitPosition(grid)
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
//type Point3D = [number, number, number]

//type Node = {
//  x: -1 | 0 | 1
//  y: -1 | 0 | 1
//  z: -1 | 0 | 1
//  point: Point
//}

// const create3DGrid = (size: number): any[][][] => {
//   const grid: any[][][] = []
//   for (let i = 0; i < size; i++) {
//     grid[i] = []
//     for (let j = 0; j < size; j++) {
//       grid[i][j] = []
//       for (let k = 0; k < size; k++) {
//         grid[i][j][k] = '.'
//       }
//     }
//   }
//   return grid
// }

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
    [1, 0],
    [2, 0],
  ]),
  new FacingEdges([
    [1, 1],
    [3, 0],
  ]),
  new FacingEdges([
    [1, 2],
    [4, 0],
  ]),
  new FacingEdges([
    [1, 3],
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
  const oppositeEdge1 = diceEdges.find(
    e => e.edges[0][0] === face && e.edges[0][1] === rotation,
  )?.edges[1]
  if (oppositeEdge1 !== undefined) return oppositeEdge1

  const oppositeEdge2 = diceEdges.find(
    e => e.edges[1][0] === face && e.edges[1][1] === rotation,
  )?.edges[0]

  if (oppositeEdge2 !== undefined) return oppositeEdge2
  throw Error('bad edge')
}

/*
0010
4230
0065
(2, 0), 1, 0
(2, 1), 3, 3
(2, 2), 6, 2
(3, 2), 1, 0
(1, 1), 6, 2
(0, 1), 5, 2

 0
3 1
 2
   new FacingEdges([
    [1, 1],
    [3, 0],
  ]),
   new FacingEdges([
    [3, 2],
    [6, 1],
  ]),
 */

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
    /*
    0010
    4230
    0065
     */
    /*
    (2, 0), 1, 0
    (2, 1), 3, 3
    (2, 2), 6, 2
    (3, 2), 5, 0
    (1, 1), 2, 3
    (0, 1), 4, 3
     */
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
        const logger = (n: number) =>
          console.log('here # ' + n, newSide, {
            dir,
            oppDir,
            rotation: side.rotation,
            oppRotation,
            newDir,
            dxDir,
          })
        if (nx === 0 && ny === 1) logger(4)
        if (nx === 2 && ny === 1) logger(3)
        if (nx === 1 && ny === 1) logger(2)
        if (nx === 3 && ny === 2) logger(5)
        if (nx === 2 && ny === 2) logger(6)

        traverseSides(newSide, grid)
      }
    })
  }
  sides.add(firstSide)
  traverseSides(firstSide, smallGrid)

  const wrapAround = (grid: Grid, [dx, dy]: Direction, [x, y]: Point) => {
    const side = sides.findSide([x, y])!
    const dirNum = DirValue[[dx, dy].toString()]
    const rotation = ((dirNum - side.rotation + 4) % 4) as Rotation
    const edge = findOppositeEdge([side.face, rotation])
    /*
      new FacingEdges([
        [3, 1],
        [5, 3],
      ]),
     */
    console.log({ dirNum, rotation })
    console.log('edge', edge)
    console.log('side', side)

    const nextSide = sides.findSideByFace(edge[0])!
    console.log('nextSide', nextSide.toString())
    const prevRotation = side.rotation
    const prevDirection = DirValue[[dx, dy].toString()]
    const nextRotation = nextSide.rotation
    const nextDirection = edge[1]
     console.log({ prevRotation, prevDirection, nextRotation, nextDirection })
    const rotateBy = ((nextDirection + nextRotation) % 4) as Rotation
    const [rx, ry] = rotatePointInGrid([x, y], size, rotateBy)
    const [nx, ny] = Directions[rotateBy]

    const newPoint = [
      nextSide.point[0] * size + ((4 + nx + rx) % size),
      nextSide.point[1] * size + ((4 + ny + ry) % size),
    ]
    const res={
      direction: Directions[rotateBy],
      point: newPoint,
    }
    console.log({rotateBy})
     console.log('res', res)
    return res
  }

  const move = (
    grid: Grid,
    [x, y]: Point,
    [dx, dy]: Direction,
    cmd: number,
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
      } = wrapAround(grid, [dx, dy], [x, y])

      if (grid[wx]?.[wy] === '#') {
        return {
          point: [x, y],
          direction,
        }
      } else {
        return {
          point: [wx, wy],
          direction,
        }
      }
    }
    return {
      point: [x, y],
      direction: [dx, dy],
    }
  }
  console.log(sides.toString())
  let dir = Directions[0]
  for (const cmd of commands) {
    const dirNum = parseInt(cmd)
    if (isNaN(dirNum)) {
      dir = transformDirection(dir, cmd as Turn)
    } else {
      const newPos = move(largeGrid, pos, dir, dirNum)
      printGrid(largeGrid, newPos.point, newPos.direction)
      dir = newPos.direction
      pos = newPos.point
    }
  }
  const row = pos[1] + 1
  const col = pos[0] + 1
  const dirValue = DirValue[dir.toString()]
  return row * 1000 + col * 4 + dirValue
}
