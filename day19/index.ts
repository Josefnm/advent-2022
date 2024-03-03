import getInput from '../utils/getInput'

const input = getInput(__dirname)

type Choice = 'geode' | 'obsidian' | 'clay' | 'ore'

const choices: Choice[] = ['ore', 'clay', 'obsidian', 'geode']

type RobotsState = {
  time: number
  ore: number
  clay: number
  obsidian: number
  geode: number
  robot: {
    ore: number
    clay: number
    obsidian: number
    geode: number
  }
}

const deepCopy = (data: RobotsState): RobotsState => ({
  time: data.time,
  ore: data.ore,
  clay: data.clay,
  obsidian: data.obsidian,
  geode: data.geode,
  robot: {
    ore: data.robot.ore,
    clay: data.robot.clay,
    obsidian: data.robot.obsidian,
    geode: data.robot.geode,
  },
})

class Robot {
  oreCost: number
  clayCost: number
  obsidianCost: number
  oreRobot: number
  clayRobot: number
  obsidianRobot: number
  geodeRobot: number
  constructor(
    oreCost: number,
    clayCost: number,
    obsidianCost: number,
    oreRobot: number,
    clayRobot: number,
    obsidianRobot: number,
    geodeRobot: number,
  ) {
    this.oreCost = oreCost
    this.clayCost = clayCost
    this.obsidianCost = obsidianCost
    this.oreRobot = oreRobot
    this.clayRobot = clayRobot
    this.obsidianRobot = obsidianRobot
    this.geodeRobot = geodeRobot
  }
}
const sumOfIncreasingIntegers = (n: number, startIndex: number) =>
  (n * (2 * startIndex + n - 1)) / 2

class Blueprint {
  robots: Record<Choice, Robot>
  maxOreCost: number
  maxClayCost: number
  maxObsidianCost: number
  blueprintNo: number
  maxTime: number
  constructor(data: string, maxTime: number) {
    this.maxTime = maxTime
    const [
      blueprintNo,
      oreCost,
      clayCost,
      obsidianOreCost,
      obsidianClayCost,
      geodeOreCost,
      geodeObsidianCost,
    ] = data.match(/\d+/g)!
    this.robots = {
      ore: new Robot(Number(oreCost), 0, 0, 1, 0, 0, 0),
      clay: new Robot(Number(clayCost), 0, 0, 0, 1, 0, 0),
      obsidian: new Robot(
        Number(obsidianOreCost),
        Number(obsidianClayCost),
        0,
        0,
        0,
        1,
        0,
      ),
      geode: new Robot(
        Number(geodeOreCost),
        0,
        Number(geodeObsidianCost),
        0,
        0,
        0,
        1,
      ),
    }
    this.blueprintNo = Number(blueprintNo)
    this.maxOreCost = Math.max(
      this.robots.ore.oreCost,
      this.robots.clay.oreCost,
      this.robots.obsidian.oreCost,
      this.robots.geode.oreCost,
    )
    this.maxClayCost = this.robots.obsidian.clayCost
    this.maxObsidianCost = this.robots.geode.obsidianCost
  }

  turnsToBuyRobot(state: RobotsState, robot: Robot) {
    const oreNeeded = Math.max(robot.oreCost - state.ore, 0)
    const clayNeeded = Math.max(robot.clayCost - state.clay, 0)
    if (clayNeeded > 0 && state.robot.clay === 0) return undefined
    const obsidianNeeded = Math.max(robot.obsidianCost - state.obsidian, 0)
    if (obsidianNeeded > 0 && state.robot.obsidian === 0) return undefined
    return Math.max(
      Math.ceil(oreNeeded / state.robot.ore),
      state.robot.clay === 0 ? 0 : Math.ceil(clayNeeded / state.robot.clay),
      state.robot.obsidian === 0
        ? 0
        : Math.ceil(obsidianNeeded / state.robot.obsidian),
    )
  }

  onRound(_state: RobotsState, choice: Choice, maxGeode: number) {
    if (choice === 'ore' && this.maxOreCost <= _state.robot.ore) {
      return undefined
    }
    if (choice === 'clay' && this.maxClayCost <= _state.robot.clay) {
      return undefined
    }
    if (
      choice === 'obsidian' &&
      this.maxObsidianCost <= _state.robot.obsidian
    ) {
      return undefined
    }

    const maxResult =
      _state.geode +
      sumOfIncreasingIntegers(this.maxTime - _state.time, _state.robot.geode)

    if (maxResult < maxGeode) {
      return undefined
    }

    const robot = this.robots[choice]

    let turnsToBuy = this.turnsToBuyRobot(_state, robot)

    if (turnsToBuy == null) {
      return undefined
    }
    turnsToBuy++

    const state = deepCopy(_state)

    if (
      turnsToBuy + state.time >= this.maxTime ||
      (turnsToBuy + state.time >= this.maxTime - 1 && choice !== 'geode') ||
      (turnsToBuy + state.time >= this.maxTime - 2 && choice === 'clay')
    ) {
      state.geode += state.robot.geode * (this.maxTime - state.time)
      state.time = this.maxTime
      return state
    }

    state.robot[choice]++
    state.ore -= robot.oreCost
    state.clay -= robot.clayCost
    state.obsidian -= robot.obsidianCost

    state.time += turnsToBuy
    state.ore += _state.robot.ore * turnsToBuy
    state.clay += _state.robot.clay * turnsToBuy
    state.obsidian += _state.robot.obsidian * turnsToBuy

    state.geode += _state.robot.geode * turnsToBuy
    return state
  }
}

const run = (data: string[], time: number) => {
  console.time('run')
  const res = data.map((d, i) => {
    console.log({ i })
    console.time(i.toString())
    const blueprint = new Blueprint(d, time)
    const initState: RobotsState = {
      time: 1,
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
      robot: {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
    }
    const queue = [initState]
    let result: RobotsState = initState
    while (queue.length) {
      const state = queue.shift()!
      for (let choice of choices) {
        const resState = blueprint.onRound(state, choice, result.geode)

        if (resState) {
          if (resState.time === time) {
            if (resState.geode >= result.geode) {
              result = resState
            }
          } else {
            queue.push(resState)
          }
        }
      }
    }
    console.timeEnd(i.toString())
    return result.geode
  })
  console.timeEnd('run')
  return res
}

export const part1 = () => {
  const time = 24
  const data = input.split('\n')
  const blueprints = run(data, time)
  return {
    res: blueprints.reduce((a, b, i) => a + b * (i + 1), 0),
  }
}

/*
time to run:
{ i: 0 }
0: 1:10.781 (m:ss.mmm)
{ i: 1 }
1: 4:13.786 (m:ss.mmm)
{ i: 2 }
2: 13.160s

 */
export const part2 = () => {
  const time = 32
  const data = input.split('\n').slice(0, 3)
  const blueprints = run(data, time)
  return { res: blueprints.reduce((a, b) => a * b, 1) }
}
