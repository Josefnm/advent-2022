import getInput from '../utils/getInput'

const input = getInput(__dirname)

type Operator = '*' | '+' | '-' | '/' | '='

const HUMAN = 'humn'
const ROOT = 'root'

class Monkey {
  name: string
  num
  names
  operator
  monkeyTown

  constructor(input: string, monkeyTown: MonkeyTown) {
    const [name, data] = input.split(': ')
    this.name = name
    this.monkeyTown = monkeyTown
    const numbers = data.match(/\d+/g)?.[0]
    if (numbers) {
      this.num = parseInt(numbers)
    } else {
      const [name1, op, name2] = data.split(' ')
      this.operator = op as Operator
      this.names = [name1, name2]
    }
  }
  getChildrenNumber(): number {
    if (this.num == null) {
      if (!this.names || !this.operator) throw Error('bad  monkey')
      const monkeys = this.monkeyTown.monkeys
      const [name1, name2] = this.names
      let num1 = monkeys[name1].getChildrenNumber()
      let num2 = monkeys[name2].getChildrenNumber()

      switch (this.operator) {
        case '+':
          this.num = num1 + num2
          break
        case '-':
          this.num = num1 - num2
          break
        case '*':
          this.num = num1 * num2
          break
        case '/':
          this.num = num1 / num2
          break
        case '=':
          if (isNaN(num1)) {
            this.num = num2 * 2
          } else {
            this.num = num1 * 2
          }
          break
        default:
          throw Error('bad operator')
      }
    }
    return this.num
  }

  setChildNumber(sum: number) {
    this.num = sum
    if (this.name === HUMAN) {
      return
    }
    if (!this.names || !this.operator) throw Error('bad  monkey')
    const monkeys = this.monkeyTown.monkeys
    const [name1, name2] = this.names
    let num1 = monkeys[name1].getChildrenNumber()
    let num2 = monkeys[name2].getChildrenNumber()
    let neededNumber: number
    if (this.name === ROOT) {
      if (isNaN(num1)) {
        monkeys[name1].setChildNumber(sum / 2)
      } else {
        monkeys[name2].setChildNumber(sum / 2)
      }
    } else {
      switch (this.operator) {
        case '+':
          if (isNaN(num1)) {
            monkeys[name1].setChildNumber(sum - num2)
          } else {
            monkeys[name2].setChildNumber(sum - num1)
          }
          break
        case '-':
          if (isNaN(num1)) {
            monkeys[name1].setChildNumber(sum + num2)
          } else {
            monkeys[name2].setChildNumber(num1 - sum)
          }
          break
        case '*':
          if (isNaN(num1)) {
            monkeys[name1].setChildNumber(sum / num2)
          } else {
            monkeys[name2].setChildNumber(sum / num1)
          }
          break
        case '/':
          if (isNaN(num1)) {
            monkeys[name1].setChildNumber(sum * num2)
          } else {
            monkeys[name2].setChildNumber(num1 / sum)
          }
          this.num = num1 / num2
          break
        default:
          throw Error('bad operator')
      }
    }
  }
}

class MonkeyTown {
  monkeys: Record<string, Monkey>
  constructor(input: string) {
    this.monkeys = Object.fromEntries(
      input
        .split('\n')
        .map(x => new Monkey(x, this))
        .map(monkey => [monkey.name, monkey]),
    )
  }
}

export const part1 = () => {
  const monkeyTown = new MonkeyTown(input)
  return monkeyTown.monkeys[ROOT].getChildrenNumber()
}

export const part2 = () => {
  const monkeyTown = new MonkeyTown(input)
  monkeyTown.monkeys[HUMAN].num = NaN
  monkeyTown.monkeys[ROOT].operator = "="
  const root = monkeyTown.monkeys[ROOT]
  root.getChildrenNumber()
  root.setChildNumber(root.num!)
  return monkeyTown.monkeys[HUMAN].num
}
