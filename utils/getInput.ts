import fs from 'fs'

export const getInput = (path: string) =>
  fs
    .readFileSync(
      `${path}/${process.argv.includes('test') ? 'example' : 'data'}.txt`,
      'utf8'
    )
    .trimEnd()

export default getInput
