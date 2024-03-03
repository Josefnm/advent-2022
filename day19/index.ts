import getInput from '../utils/getInput'

const input = getInput(__dirname)

const MINS = 24

type Choice = 'geode' | 'obsidian' | 'clay' | 'ore'

const choices: Choice[] = ['ore', 'clay', 'obsidian', 'geode']

type RobotsState = {
  minutes: number
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
  choices: Choice[]
  data: any[]
}

const correct = [
  [3, 0],
  [5, 0],
  [6, 1],
  [7, 1],
  [8, 1],
  [9, 1],
  [10, 1],
  [11, 1],
  [12, 2],
  [13, 2],
  [14, 2],
  [15, 2],
  [16, 1],
  [17, 2],
  [18, 3],
  [19, 2],
  [20, 3],
  [21, 2],
  [22, 3],
  [24, 3],
]

const deepCopy = (data: RobotsState): RobotsState => ({
  minutes: data.minutes,
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
  choices: [...data.choices],
  data: [...data.data],
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

class Blueprint {
  robots: Record<Choice, Robot>
  maxOreCost: number
  maxClayCost: number
  maxObsidianCost: number
  blueprintNo: number
  constructor(data: string) {
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

  onRound(_state: RobotsState, choice: Choice) {
    //if (_state.minutes === 23) {
    //  return undefined
    //}
    //if (_state.minutes >= 22 && choice !== 'geode') {
    //  return undefined
    //}
    // if (_state.minutes >= 21 && choice === 'clay') {
    //   return undefined
    // }
    const isCorrectPath =
      _state.choices.toString() === [null, null, 'ore', null, 'ore'].toString()
    if (isCorrectPath) {
      console.log('isCorrectPath', 1)
    }
    if (choice === 'ore' && this.maxOreCost <= _state.robot.ore) {
      return undefined
    }
    if (choice === 'clay' && this.maxClayCost <= _state.robot.clay) {
      if (isCorrectPath) {
        console.log('no clay', 1)
      }
      return undefined
    }
    if (
      choice === 'obsidian' &&
      this.maxObsidianCost <= _state.robot.obsidian
    ) {
      return undefined
    }
    if (isCorrectPath) {
      console.log('isCorrectPath', 2)
    }
    /*
    [
  [ 3, 0 ],  [ 5, 0 ],  [ 6, 1 ],
  [ 7, 1 ],  [ 8, 1 ],  [ 9, 1 ],
  [ 10, 1 ], [ 11, 1 ], [ 12, 2 ],
  [ 13, 2 ], [ 14, 2 ], [ 15, 2 ],
  [ 16, 1 ], [ 17, 2 ], [ 18, 3 ],
  [ 19, 2 ], [ 20, 3 ], [ 21, 2 ],
  [ 22, 3 ], [ 24, 3 ]
]
     */

    // if (_state.choices[2] === 'ore' && _state.choices.length === 3) {
    //   console.log('correct path')
    // }

    const robot = this.robots[choice]

    let turnsToBuy = this.turnsToBuyRobot(_state, robot)

    if (turnsToBuy == null) {
      return undefined
    }
    turnsToBuy++

    const state = deepCopy(_state)

    if (turnsToBuy + state.minutes > MINS) {
      const toAdd = state.robot.geode * (MINS - state.minutes)
      state.geode += toAdd
      state.data.push(toAdd)
      state.minutes = MINS
      return state
    } else {
      state.robot[choice]++
      state.ore -= robot.oreCost
      state.clay -= robot.clayCost
      state.obsidian -= robot.obsidianCost
    }

    state.minutes += turnsToBuy
    state.ore += _state.robot.ore * turnsToBuy
    state.clay += _state.robot.clay * turnsToBuy
    state.obsidian += _state.robot.obsidian * turnsToBuy
    const addGeo = _state.robot.geode * turnsToBuy
    state.geode += _state.robot.geode * turnsToBuy
    if (choice === 'geode') {
      state.data.push(addGeo)
    }
    for (let i = 1; i < turnsToBuy; i++) {
      // @ts-ignore
      state.choices.push(null)
    }
    state.choices.push(choice)
    if (
      _state.choices[2] === 'ore' &&
      _state.choices.length === 3 &&
      choice === 'ore'
    ) {
      console.log(choice, turnsToBuy, state)
    }
    return state
  }
}

export const part1 = () => {
  const data = input.split('\n')
  // console.time()
  const blueprints = data.map((d, i) => {
    // console.log(i)
    const blueprint = new Blueprint(d)
    const initState: RobotsState = {
      minutes: 1,
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
      // @ts-ignore
      choices: [null],
      data: [],
    }
    const queue = [initState]
    let result: RobotsState | undefined = undefined
    const results = []
    // let counter = 0
    while (queue.length) {
      const state = queue.shift()!
      // counter++
      // if (counter % 100000 === 0) {
      //   console.log(queue.length, state)
      // }

      for (let choice of choices) {
        const resState = blueprint.onRound(state, choice)

        if (resState) {
          if (resState.minutes === MINS) {
            if (result == null || resState.geode >= result.geode) {
              result = resState
              if (resState.geode === 9) {
                results.push(resState)
              }
            }
          } else {
            queue.push(resState)
          }
        }
      }
    }
    return {
      blueprint,
      ...result!, // [ 3, 7, 7, 4 ]
      // results: results.find(r => r.robot.ore === 3),
    }
  })

  console.log(blueprints[0].choices)
  // console.log(blueprints[1])
  return blueprints.sort((a, b) => b.geode - a.geode)[0].geode
}
// @ts-ignore
import x from './testing.js'

// console.log('improt', x.pathRes)
export const part2 = () => {}
