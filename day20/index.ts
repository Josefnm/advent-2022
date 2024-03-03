import getInput from '../utils/getInput'

const input = getInput(__dirname)

class Node {
  value: number
  next: Node | undefined
  prev: Node | undefined
  constructor(value: number, multiplier: number) {
    this.value = value * multiplier
  }
  insertAfter(node: Node) {
    if (this === node) return
    this.prev = node
    this.next = node.next
    node.next = this
    this.next!.prev = this
  }
  remove() {
    this.prev!.next = this.next
    this.next!.prev = this.prev
  }
  getNode(n: number) {
    let node: Node = this
    if (n > 0) {
      for (let i = 0; i < n; i++) {
        node = node.next!
      }
    } else {
      for (let i = 0; i >= n; i--) {
        node = node.prev!
      }
    }
    return node
  }
}

const run = (rounds: number, multiplier: number) => {
  const data = input
    .split('\n')
    .map(s => new Node(Number(s), multiplier))
    .map((node, i, arr) => {
      node.prev = arr[i - 1] || arr[arr.length - 1]
      node.next = arr[i + 1] || arr[0]
      return node
    })

  for (let i = 0; i < rounds * data.length; i++) {
    const node = data[i % data.length]
    if (node.value === 0) continue
    node.remove()
    const gotNode = node.getNode(node.value % (data.length - 1))
    node.insertAfter(gotNode)
  }

  let node = data.find(n => n.value === 0)!
  const result = []
  for (let i = 1; i <= 3000; i++) {
    node = node.next!
    if (i % 1000 === 0) {
      result.push(node.value)
    }
  }
  return result.reduce((a, b) => a + b, 0)
}

export const part1 = () => {
  return run(1, 1)
}

export const part2 = () => {
  return run(10, 811589153)
}
