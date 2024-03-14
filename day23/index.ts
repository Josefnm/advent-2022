import getInput from '../utils/getInput'

const input = getInput(__dirname)

type Point = [number, number]

type Dir = 'N' | 'E' | 'S' | 'W' | 'NE' | 'SE' | 'SW' | 'NW'

type GridPoint = '.' | '#'
type Grid = GridPoint[][]

const directions: Record<Dir, Point> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
  NE: [1, -1],
  SE: [1, 1],
  SW: [-1, 1],
  NW: [-1, -1],
}

const directionSets = [
  [directions.N, directions.NE, directions.NW],
  [directions.S, directions.SE, directions.SW],
  [directions.W, directions.NW, directions.SW],
  [directions.E, directions.NE, directions.SE],
]

const createGrid = (padding: number): Grid => {
  const data = input.split('\n')
  const gridInput = data.map(s => s.split('')) as Grid
  const xAxis = gridInput[0].length + padding * 2
  const yAxis = gridInput.length + padding * 2
  const grid: Grid = []
  for (let x = 0; x < xAxis; x++) {
    grid[x] = []
    for (let y = 0; y < yAxis; y++) {
      grid[x][y] = gridInput[y - padding]?.[x - padding] ?? '.'
    }
  }
  return grid
}

const findBBox = (grid: Grid) => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[x][y] === '#') {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  return { minX, minY, maxX, maxY }
}

const calculateScore = (grid: Grid) => {
  const bbox = findBBox(grid)
  const res = { x: bbox.maxX - bbox.minX + 1, y: bbox.maxY - bbox.minY + 1 }
  let count = 0
  for (let x = bbox.minX; x < bbox.maxX + 1; x++) {
    for (let y = bbox.minY; y < bbox.maxY + 1; y++) {
      if (grid[x][y] === '#') count++
    }
  }
  return res.x * res.y - count
}

const run = (rounds: number) => {
  const grid = createGrid(100)
  let round = 0
  while (round < rounds) {
    const checkDirections = ([x, y]: Point, points: Point[]) =>
      !points.some(([dx, dy]) => grid[x + dx][y + dy] === '#')
    const moves: {
      prev: Point
      next: Point
    }[] = []
    // find moves
    for (let x = 0; x < grid[0].length; x++) {
      for (let y = 0; y < grid.length; y++) {
        const point: Point = [x, y]
        if (grid[x][y] !== '#') continue
        const noMove = !Object.values(directions).some(
          dir => grid[x + dir[0]][y + dir[1]] === '#',
        )
        if (noMove) continue

        for (let i = 0; i < directionSets.length; i++) {
          const dir = directionSets[(i + round) % 4]
          const [[dx, dy]] = dir
          if (checkDirections(point, dir)) {
            moves.push({ prev: point, next: [x + dx, y + dy] })
            break
          }
        }
      }
    }
    if (moves.length === 0) {
      break
    }
    // filter out duplicate moves
    const filteredMoves = moves.filter(
      ({ next: [x1, y1], prev: prev1 }) =>
        !moves.some(
          ({ next: [x2, y2], prev: prev2 }) =>
            x1 === x2 && y1 === y2 && prev1.toString() !== prev2.toString(),
        ),
    )
    // apply moves
    filteredMoves.forEach(({ prev, next }) => {
      const [x, y] = prev
      const [nx, ny] = next
      grid[nx][ny] = '#'
      grid[x][y] = '.'
    })
    // console.log('round', round + 1)
    round++
  }

  return {
    score: calculateScore(grid),
    round: round + 1,
  }
}

export const part1 = () => {
  const rounds = 10
  return run(rounds).score
}

export const part2 = () => {
  const rounds = 1_000_000_000
  return run(rounds).round
}
