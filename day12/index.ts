import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

const START = 'S'.charCodeAt(0)
const END = 'E'.charCodeAt(0)

type Point = readonly [number, number]
type Position = { char: number; visited: boolean }
type Grid = Position[][]

const parseInput = (): Grid =>
  input.split('\n').map(s1 =>
    s1.split('').map(s2 => ({
      char: s2.charCodeAt(0),
      visited: false,
    }))
  )

const findItem = (grid: Grid, item: number): Point[] => {
  let items: Point[] = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j].char === item) {
        items.push([i, j])
      }
    }
  }
  return items
}

const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const

const sumPoints = ([x, y]: Point, [dx, dy]: Point): Point => [x + dx, y + dy]

const toHeight = (height: number) => {
  if (height === END) return 'y'.charCodeAt(0)
  if (height === START) return 'a'.charCodeAt(0)
  return height
}

const findPathsForward = (path: Point[], grid: Grid): Point[] => {
  const currentPoint = path.at(-1)!
  const currentPos = grid[currentPoint[0]][currentPoint[1]]

  const validDirs = dirs
    .map(dir => sumPoints(currentPoint, dir))
    .filter(([x, y]: Point) => {
      const nextPos = grid[x]?.[y]
      if (nextPos == null || nextPos.visited) return false
      return toHeight(currentPos.char) + 1 >= toHeight(nextPos.char)
    })
  validDirs.forEach(([x, y]) => {
    grid[x][y].visited = true
  })

  return validDirs
}

const findShortestPath = (startPoint: Point, grid: Grid) => {
  let paths = [[startPoint]]
  let counter = 0
  while (counter < 10000) {
    paths = paths
      .map(path => findPathsForward(path, grid).map(p => [...path, p]))
      .flat()

    const endFound = paths.find(p => {
      const [x, y] = p.at(-1)!
      return grid[x][y].char === END
    })
    if (endFound) {
      return endFound.length - 1
    }
    counter++
  }
}

export const part1 = () => {
  const grid = parseInput()
  const startPoint = findItem(grid, START)[0]
  grid[startPoint[0]][startPoint[1]].visited = true
  return findShortestPath(startPoint, grid)
}

export const part2 = () => {
  const baseGrid = parseInput()
  return findItem(baseGrid, 'a'.charCodeAt(0))
    .map(p => {
      const grid = parseInput()
      grid[p[0]][p[1]].visited = true
      return findShortestPath(p, grid)
    })
    .filter(p => p != null)
    .sort((a, b) => (a as number) - (b as number))
    .at(0)
}
