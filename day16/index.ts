import { getInput } from '../utils/getInput'

const input = getInput(__dirname)

type Step = {
  time: number
  valve: string
}

type Path = Step[]

type Valve = {
  valve: string
  tunnels: string[]
  rate: number
}

type Valves = Record<string, Valve>

const createPaths = (
  valve: Valve,
  target: string,
  paths: Valves,
): PathBetween => {
  let current = new Set(valve.tunnels)
  let depth = 1
  while (depth < Object.keys(paths).length) {
    let next: string[][] = []
    for (const c of current) {
      if (c === target)
        return {
          depth,
          target,
        }
      next.push(paths[c].tunnels)
    }
    depth++
    current = new Set(next.flat())
  }
  throw Error('none found')
}

type PathBetween = {
  depth: number
  target: string
}

type Node = {
  valve: Valve
  paths: PathBetween[]
}

type Nodes = Record<string, Node>

type Node2 = {
  valve: Valve
  paths: [PathBetween, PathBetween][]
}

type Nodes2 = Record<string, Node2>

const getPressure = (
  history: Path,
  valves: Nodes,
  maxDepth: number,
): Path[] => {
  const last = history.at(-1)!
  const valve = valves[last!.valve]
  if (last.time < 1 || maxDepth === history.length) return [history]
  return (
    valve.paths
      .map(next => {
        if (history.find(s => s.valve === next.target)) return null
        const time = last.time - (next.depth + 1)
        if (time < 1) return [history]
        const nextHistory: Path = [
          ...history,
          {
            valve: next.target,
            time,
          },
        ]
        return getPressure(nextHistory, valves, maxDepth)
      })
      .filter(a => !!a) as Path[][]
  ).flat()
}

const getValves = () =>
  input.split('\n').reduce<Valves>((acc, cur) => {
    const rate = +cur.match(/\d+/)![0]
    const [valve, ...tunnels] = cur.match(/[A-Z]{2}/g)!
    acc[valve] = {
      valve,
      tunnels,
      rate,
    }
    return acc
  }, {})

const getAllNodes = (valves: Valves): Nodes => {
  const relevantValves = [
    valves['AA'],
    ...Object.values(valves).filter(
      item => item.rate > 0 && item.valve !== 'AA',
    ),
  ]

  const nodes: Nodes = {}
  for (const valve1 of relevantValves) {
    const paths: PathBetween[] = []
    for (const valve2 of relevantValves) {
      if (valve1 === valve2) continue
      paths.push(createPaths(valve1, valve2.valve, valves))
    }
    nodes[valve1.valve] = {
      valve: valve1,
      paths,
    }
  }
  return nodes
}

export const part1 = () => {
  const valves = getValves()
  const nodes = getAllNodes(valves)
  const length = Object.keys(nodes).length
  const startNode = {
    valve: 'AA',
    time: 30,
  }

  const pressurePaths = getPressure([startNode], nodes, length)
  return pressurePaths
    .map(path =>
      path.reduce((acc, { time, valve }) => acc + valves[valve].rate * time, 0),
    )
    .sort((a, b) => b - a)[0]
}

export const part2 = () => {
  const valves = getValves()
  const nodes = getAllNodes(valves)
  const length = Object.keys(nodes).length
  const startNode = {
    valve: 'AA',
    time: 26,
  }

  const uniquePaths = getPressure([startNode], nodes, length)
    .map(path => ({
      key: path
        .map(s => s.valve)
        .sort()
        .join(''),
      path,
      pressure: path.reduce(
        (acc, { time, valve }) => acc + valves[valve].rate * time,
        0,
      ),
    }))
    .reduce(
      (acc, { key, ...value }) => {
        if (!(acc[key] && acc[key].pressure > value.pressure)) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, { path: Path; pressure: number }>,
    )
  const pressurePaths = Object.values(uniquePaths).map(s => s.path)

  return pressurePaths
    .map(path => pressurePaths.map(path2 => [path, path2]))
    .flat()
    .map(([path1, path2]) => {
      const newPath: Record<string, Step> = {}
      for (const p2 of path1) {
        newPath[p2.valve] = p2
      }
      for (const p2 of path2) {
        if (newPath[p2.valve] && newPath[p2.valve].time < p2.time) {
          if (newPath[p2.valve].time < p2.time) {
            newPath[p2.valve] = p2
          }
        } else {
          newPath[p2.valve] = p2
        }
      }
      return Object.values(newPath)
    })
    .map(path =>
      path.reduce((acc, { time, valve }) => acc + valves[valve].rate * time, 0),
    )
    .sort((a, b) => b - a)[0]
}
