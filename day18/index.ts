import getInput from '../utils/getInput'

const input = getInput(__dirname)

class Point3d {
  x: number
  y: number
  z: number
  adjacentCount = 0
  static emptySides = 6
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  checkAdjacent(p: Point3d) {
    const totalDist =
      Math.abs(this.x - p.x) + Math.abs(this.y - p.y) + Math.abs(this.z - p.z)
    if (totalDist === 1) {
      this.adjacentCount++
    }
  }
  getEmptySides() {
    return Point3d.emptySides - this.adjacentCount
  }
}

const createPoints = () =>
  input
    .split('\n')
    .map(x => x.replace('\r', ''))
    .map(s => {
      const [x, y, z] = s.split(',').map(Number)
      return new Point3d(x, y, z)
    })

const getEmptySides = (data: Point3d[]) => {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue
      data[i].checkAdjacent(data[j])
    }
  }
  return data.map(p => p.getEmptySides()).reduce((a, b) => a + b, 0)
}

export const part1 = () => {
  const data = createPoints()

  return getEmptySides(data)
}

type Dot = 'o' | 'x' | 'y'

type Grid = Dot[][][]

const create3dGrid = (data: Point3d[]) => {
  let minX = Number.MAX_VALUE
  let minY = Number.MAX_VALUE
  let minZ = Number.MAX_VALUE
  let maxX = -Number.MIN_VALUE
  let maxY = -Number.MIN_VALUE
  let maxZ = -Number.MIN_VALUE

  for (const point of data) {
    if (point.x > maxX) maxX = point.x
    if (point.y > maxY) maxY = point.y
    if (point.z > maxZ) maxZ = point.z
    if (point.x < minX) minX = point.x
    if (point.y < minY) minY = point.y
    if (point.z < minZ) minZ = point.z
  }
  // add padding to mins and max
  minX--
  minY--
  minZ--
  maxX++
  maxY++
  maxZ++

  const grid: Grid = []
  for (let x = minX; x <= maxX; x++) {
    grid[x] = []
    for (let y = minY; y <= maxY; y++) {
      grid[x][y] = []
      for (let z = minZ; z <= maxZ; z++) {
        grid[x][y][z] = 'o'
      }
    }
  }
  data.forEach(p => {
    grid[p.x + Math.abs(minX)][p.y + Math.abs(minY)][p.z + Math.abs(minZ)] = 'x'
  })
  return grid
}

const inBounds = (x: number, y: number, z: number, grid: Grid) => {
  return (
    x >= 0 &&
    x < grid.length &&
    y >= 0 &&
    y < grid[0].length &&
    z >= 0 &&
    z < grid[0][0].length
  )
}

export const part2 = () => {
  const data = createPoints()
  const grid = create3dGrid(data)
  const queue = [[0, 0, 0]]

  while (queue.length) {
    const [x, y, z] = queue.shift()!
    if (!inBounds(x, y, z, grid) || grid[x][y][z] !== 'o') {
      continue
    }
    grid[x][y][z] = 'y'
    queue.push([x + 1, y, z])
    queue.push([x - 1, y, z])
    queue.push([x, y + 1, z])
    queue.push([x, y - 1, z])
    queue.push([x, y, z + 1])
    queue.push([x, y, z - 1])
  }
  const gridPoints: Point3d[] = []
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      let row = ''
      for (let z = 0; z < grid[0][0].length; z++) {
        row += grid[x][y][z]
        const p = grid[x][y][z]
        if (p === 'o' || p === 'x') {
          gridPoints.push(new Point3d(x, y, z))
        }
      }
    }
  }
  return getEmptySides(gridPoints)
}
