import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

type Files = { [Key: string]: string | Files }

/*
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
 */

const traverseData = (file: Files, command: string) => {}

const createFiles = () => {
  const files: Files = {}
  const data = input.split('\n').forEach(item => {})
}

export const part1 = () => ''

export const part2 = () => ''
