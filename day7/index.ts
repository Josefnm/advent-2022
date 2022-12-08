import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

class Dir {
  filesSize = 0
  dirs: Dir[] = []
  parent: Dir | null
  totalSize: number | undefined

  constructor(parent: Dir | null) {
    this.parent = parent
  }
  static createDirs(): Dir {
    const root = new Dir(null)
    input
      .split('\n')
      .slice(1)
      .reduce((acc, cur) => acc.handleInput(cur), root)
    return root
  }
  private getSize(): number {
    if (typeof this.totalSize !== 'number') {
      this.totalSize =
        this.filesSize + this.dirs.reduce((acc, cur) => acc + cur.getSize(), 0)
    }
    return this.totalSize
  }
  getAllSizes(): number[] {
    return [this.getSize(), ...this.dirs.map(dir => dir.getAllSizes()).flat()]
  }
  handleInput(line: string): Dir {
    if (line.includes('$ cd ..')) {
      if (this.parent == null) throw Error("You've dug too shallow")
      return this.parent
    } else if (line.includes('$ cd ')) {
      const subDir = new Dir(this)
      this.dirs.push(subDir)
      return subDir
    } else if (line.match(/\d+/)?.[0] != null) {
      this.filesSize += +line.match(/\d+/)?.[0]!
    }
    return this
  }
  sumAllFoldersSmallerThan(size: number): number {
    return this.getAllSizes()
      .filter(n => n <= size)
      .reduce((acc, cur) => acc + cur, 0)
  }
  findFolderToDeleteByTotalSizeTarget(size: number): number {
    const spaceNeeded = this.getSize() - size
    const folder = this.getAllSizes()
      .sort((a, b) => a - b)
      .find(item => item > spaceNeeded)
    if (folder == null)
      throw new Error(`couldn't find a folder smaller than: ${spaceNeeded}`)
    return folder
  }
}

const MAX_SIZE = 100_000
const TARGET_SIZE = 40_000_000

export const part1 = () => Dir.createDirs().sumAllFoldersSmallerThan(MAX_SIZE)

export const part2 = () =>
  Dir.createDirs().findFolderToDeleteByTotalSizeTarget(TARGET_SIZE)
