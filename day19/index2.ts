import getInput from '../utils/getInput'

const input = getInput(__dirname)

const MINS = 24

type Choice = 'geode' | 'obsidian' | 'clay' | 'ore' | 'none'

class Blueprint {
  oreRobot: number
  clayRobot: number
  obsidianRobot: { ore: number; clay: number }
  geodeRobot: { ore: number; obsidian: number }
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
    this.blueprintNo = Number(blueprintNo)
    this.oreRobot = Number(oreCost)
    this.clayRobot = Number(clayCost)
    this.obsidianRobot = {
      ore: Number(obsidianOreCost),
      clay: Number(obsidianClayCost),
    }
    this.geodeRobot = {
      ore: Number(geodeOreCost),
      obsidian: Number(geodeObsidianCost),
    }
  }
}

type RobotsState = {
  ore: number
  clay: number
  obsidian: number
  geode: number
  oreRobot: number
  clayRobot: number
  obsidianRobot: number
  geodeRobot: number
  choices: Choice[]
}

const getInitState = (): RobotsState => ({
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
  oreRobot: 1,
  clayRobot: 0,
  obsidianRobot: 0,
  geodeRobot: 0,
  choices: [],
})

const choices: Choice[] = ['geode', 'obsidian', 'clay', 'ore']

const createChoiceCombinations = (totalChoices = 10) => {
  const combinations = Math.pow(4, totalChoices)
  const res: Choice[][] = []
  for (let i = 0; i < totalChoices; i++) {
    for (let j = 0; j < combinations; j++) {
      if (i === 0) res.push([])
      const cidx = Math.floor(j / Math.pow(4, i)) % 4
      res[j].push(choices[cidx])
    }
  }
  // const sets = new Set(res.map(r => r.join('')))
  // console.log(res.slice(0, 5))
  // console.log(res.length, sets.size)
  console.log('HERE')
  return res.filter(
    e =>
      e[0] !== 'obsidian' &&
      e[0] !== 'geode' &&
      e[1] !== 'geode' &&
      e[totalChoices - 2] === 'geode',
  )
}
// @ts-ignore
import a from './testing.js'

export const part1 = () => {
  const data = input.split('\n')
  console.log(a)

  const choiceCombinations = createChoiceCombinations(10)

  const blueprints = data.map((d, i) => {
    console.log(i)
    const blueprint = new Blueprint(d)
    let result: RobotsState | undefined
    for (let choices of choiceCombinations) {
      let state = getInitState()

      for (let j = 0; j < MINS; j++) {
        let geodeRobot = 0
        let obsidianRobot = 0
        let clayRobot = 0
        let oreRobot = 0
        const choice = choices[0] || 'none'
        switch (choice) {
          case 'geode':
            if (
              state.ore >= blueprint.geodeRobot.ore &&
              state.obsidian >= blueprint.geodeRobot.obsidian
            ) {
              state.ore -= blueprint.geodeRobot.ore
              state.obsidian -= blueprint.geodeRobot.obsidian
              geodeRobot++
              state.choices.push(choices.shift()!)
            } else {
              state.choices.push('none')
            }
            break
          case 'obsidian':
            if (
              state.ore >= blueprint.obsidianRobot.ore &&
              state.clay >= blueprint.obsidianRobot.clay
            ) {
              state.ore -= blueprint.obsidianRobot.ore
              state.clay -= blueprint.obsidianRobot.clay
              obsidianRobot++
              state.choices.push(choices.shift()!)
            } else {
              state.choices.push('none')
            }
            break
          case 'clay':
            if (state.ore >= blueprint.clayRobot) {
              state.ore -= blueprint.clayRobot
              clayRobot++
              state.choices.push(choices.shift()!)
            } else {
              state.choices.push('none')
            }
            break
          case 'ore':
            if (state.ore >= blueprint.oreRobot) {
              state.ore -= blueprint.oreRobot
              oreRobot++
              state.choices.push(choices.shift()!)
            } else {
              state.choices.push('none')
            }
            break
          case 'none':
            state.choices.push('none')
        }

        state.ore += state.oreRobot
        state.clay += state.clayRobot
        state.obsidian += state.obsidianRobot
        state.geode += state.geodeRobot
        state.oreRobot += oreRobot
        state.clayRobot += clayRobot
        state.obsidianRobot += obsidianRobot
        state.geodeRobot += geodeRobot
      }
      if (!result || result.geode < state.geode) {
        result = state
      }
    }

    return {
      blueprint,
      ...result!,
    }
  })
  console.log(blueprints)
  return blueprints.sort((a, b) => b.geode - a.geode)[0].geode
}

export const part2 = () => {}
const testOrder = [
  'none', // correct
  'none',
  'clay', // 3 // correct
  'none',
  'clay', // 5 // correct
  'none',
  'clay', // 7 // correct
  'none',
  'none', // correct
  'none',
  'obsidian', // 11 // correct
  'clay', // 12
  'none', // correct
  'none', // 14
  'obsidian', // 15
  'none',
  'none',
  'geode', // 18
  'none',
  'none',
  'geode', // 21
  'none',
  'none',
  'none',
]
const y = [
  null,
  null,
  'clay',
  null,
  'clay',
  null,
  'clay',
  null,
  null,
  null,
  'obsidian',
  'clay',
  null,
  null,
  'obsidian',
  null,
  null,
  'geode',
  'clay',
  null,
  'geode',
  null,
  null,
  'obsidian',
]
