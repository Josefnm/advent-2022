import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

class Dir {
  private readonly filesSize = 0
  private readonly dirs: Dir[] = []
  private totalSize: number | undefined

  constructor(commands: string[]) {
    while (true) {
      const command = commands.shift()
      if (!command || command === '$ cd ..') {
        break
      } else if (command.includes('$ cd ')) {
        const subDir = new Dir(commands)
        this.dirs.push(subDir)
      } else if (command.match(/\d+/)?.[0] != null) {
        this.filesSize += +command.match(/\d+/)?.[0]!
      }
    }
  }

  private getSize(): number {
    if (typeof this.totalSize !== 'number') {
      this.totalSize =
        this.filesSize + this.dirs.reduce((acc, cur) => acc + cur.getSize(), 0)
    }
    return this.totalSize
  }
  private getAllSizes(): number[] {
    return [this.getSize(), ...this.dirs.map(dir => dir.getAllSizes()).flat()]
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

const directory = new Dir(input.split('\n'))

export const part1 = () => directory.sumAllFoldersSmallerThan(MAX_SIZE)

export const part2 = () =>
  directory.findFolderToDeleteByTotalSizeTarget(TARGET_SIZE)
