import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

const WIDTH = 7
const X_OFFSET = 2
const Y_OFFSET = 3
const SHAPES = 5
type Direction = '<' | '>'

class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
type Shape = Point[]

class Rock {
  shape: Shape
  chamber: Chamber
  constructor(n: number, chamber: Chamber) {
    this.chamber = chamber
    const top = chamber.height
    switch (n % 5) {
      case 0:
        // -'
        this.shape = [
          new Point(X_OFFSET, top + Y_OFFSET),
          new Point(X_OFFSET + 1, top + Y_OFFSET),
          new Point(X_OFFSET + 2, top + Y_OFFSET),
          new Point(X_OFFSET + 3, top + Y_OFFSET),
        ]
        break
      case 1:
        // +
        this.shape = [
          new Point(X_OFFSET + 1, top + Y_OFFSET),
          new Point(X_OFFSET, top + Y_OFFSET + 1),
          new Point(X_OFFSET + 1, top + Y_OFFSET + 1),
          new Point(X_OFFSET + 2, top + Y_OFFSET + 1),
          new Point(X_OFFSET + 1, top + Y_OFFSET + 2),
        ]
        break
      case 2:
        // J
        this.shape = [
          new Point(X_OFFSET, top + Y_OFFSET),
          new Point(X_OFFSET + 1, top + Y_OFFSET),
          new Point(X_OFFSET + 2, top + Y_OFFSET),
          new Point(X_OFFSET + 2, top + Y_OFFSET + 1),
          new Point(X_OFFSET + 2, top + Y_OFFSET + 2),
        ]
        break
      case 3:
        // I
        this.shape = [
          new Point(X_OFFSET, top + Y_OFFSET),
          new Point(X_OFFSET, top + Y_OFFSET + 1),
          new Point(X_OFFSET, top + Y_OFFSET + 2),
          new Point(X_OFFSET, top + Y_OFFSET + 3),
        ]
        break
      case 4:
        // #
        this.shape = [
          new Point(X_OFFSET, top + Y_OFFSET),
          new Point(X_OFFSET + 1, top + Y_OFFSET),
          new Point(X_OFFSET, top + Y_OFFSET + 1),
          new Point(X_OFFSET + 1, top + Y_OFFSET + 1),
        ]
        break
      default:
        throw new Error('Invalid rock type')
    }
  }

  tryMoveDown() {
    const oldShape = [...this.shape]
    this.shape = this.shape.map(p => new Point(p.x, p.y - 1))
    if (this.overlaps()) {
      this.shape = oldShape
      return false
    }
    return true
  }

  tryMoveHorizontal(direction: Direction) {
    const oldShape = [...this.shape]

    const dx = direction === '<' ? -1 : 1
    this.shape = this.shape.map(p => new Point(p.x + dx, p.y))

    if (this.isOutOfBounds() || this.overlaps()) {
      this.shape = oldShape
    }
  }

  isOutOfBounds() {
    return this.shape.some(p => p.x < 0 || p.x >= WIDTH)
  }

  overlaps() {
    return this.shape.some(p => p.y < 0 || this.chamber.grid[p.x][p.y])
  }

  getHighestPoint() {
    return Math.max(...this.shape.map(p => p.y))
  }
}

class Chamber {
  height = 0
  fallen: Rock[] = []
  grid: boolean[][] = []
  constructor(rocks: number) {
    this.grid = Array.from({ length: rocks + 5000 }, () =>
      Array.from({ length: WIDTH }, () => false),
    )
  }
  onFallen(rock: Rock) {
    rock.shape.forEach(p => {
      this.grid[p.x][p.y] = true
    })
    this.fallen.push(rock)
    const highestPoint = rock.getHighestPoint()
    if (highestPoint >= this.height) {
      this.height = highestPoint + 1
    }
  }
}

export const part1 = () => {
  const ROCKS = 2022
  const chamber = new Chamber(ROCKS)
  const wind = input.split('') as Direction[]
  let wix = 0
  for (let i = 0; i < ROCKS; i++) {
    const rock = new Rock(i, chamber)
    let turn = 0
    while (true) {
      if (turn % 2 === 0) {
        const currentWind = wind.at(wix % wind.length)
        wix += 1
        rock.tryMoveHorizontal(currentWind!)
      } else {
        if (!rock.tryMoveDown()) {
          break
        }
      }
      turn++
    }
    chamber.onFallen(rock)
  }
  return chamber.height
}

export const part2 = () => {
  const ROCKS = 1_000_000_000_000
  const wind = input.split('') as Direction[]
  const rocksToSimulate = wind.length * SHAPES * 2 // enough to cover the cycle
  const chamber = new Chamber(rocksToSimulate)

  const cycle = wind.length * SHAPES
  let windIdx = 0
  const heights: number[] = []
  let prevHeight = 0
  let prevRockIdx = 0
  for (let i = 0; i < rocksToSimulate; i++) {
    heights.push(chamber.height)
    const rock = new Rock(i, chamber)
    let turn = 0
    while (true) {
      if (turn % 2 === 0) {
        const currentWind = wind.at(windIdx % wind.length)
        windIdx += 1
        rock.tryMoveHorizontal(currentWind!)

        if (windIdx % cycle === 0) {
          if (i > cycle) {
            const rocksPerCycle = i - prevRockIdx
            const heightPerCycle = chamber.height - prevHeight
            const totalCycles = Math.floor(ROCKS / rocksPerCycle)
            const startAt = ROCKS % rocksPerCycle
            return totalCycles * heightPerCycle + heights[startAt]
          }
          prevRockIdx = i
          prevHeight = chamber.height
        }
      } else {
        if (!rock.tryMoveDown()) {
          break
        }
      }
      turn++
    }
    chamber.onFallen(rock)
  }
  throw new Error('No result')
}
