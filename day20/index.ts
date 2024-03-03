import getInput from '../utils/getInput'

const input = getInput(__dirname)

class Node {
  value: number
  next: Node | undefined
  prev: Node | undefined
  constructor(value: number) {
    this.value = value
  }
  insertAfter(node: Node) {
    if (this === node) return
    const prev = this.prev!
    const next = this.next!
    prev.next = next
    next.prev = prev
    this.prev = node
    this.next = node.next
    node.next = this
    this.next!.prev = this
    /*
     prev.next = next
    next.prev = prev
     */
  }
  getNode(n: number) {
    let node: Node = this
    if (n === 0) return node
    if (n > 0) {
      for (let i = 0; i < n; i++) {
        node = node.next!
      }
    } else {
      for (let i = 0; i >= n; i--) {
        //console.log(i, ',', node.prev?.value)
        node = node.prev!
      }
    }
    return node
  }
}
const init = '1, 2, -3, 3, -2, 0, 4'

const facit = [
  '2, 1, -3, 3, -2, 0, 4',
  '1, -3, 2, 3, -2, 0, 4',
  '1, 2, 3, -2, -3, 0, 4',
  '1, 2, -2, -3, 0, 3, 4',
  '1, 2, -3, 0, 3, 4, -2',
  '1, 2, -3, 0, 3, 4, -2',
  '1, 2, -3, 4, 0, 3, -2',
]

export const part1 = () => {
  const data = input.split('\n').map(s => new Node(Number(s)))
  for (let i = 0; i < data.length; i++) {
    data[i].prev = data[i - 1] || data[data.length - 1]
    data[i].next = data[i + 1] || data[0]
  }

  console.log(data.filter(n => n.value === 0).length)
  const iters: number = 7
  // console.log(data[0])
  data.forEach(node => {
    const gotNode = node.getNode(node.value)
    // console.log('gotnode', node.value, gotNode.value)
    node.insertAfter(gotNode)
  })
  const logger = (i: number = 0) => {
    let node = data[i]
    const res = []
    for (let i = 0; i <= data.length; i++) {
      res.push(node.value)
      node = node.next!
    }

    console.log(res.join(', '))
    console.log(facit[iters - 1])
  }
  // logger(iters === 1 ? 1 : 0)

  let node = data.find(n => n.value === 0)!
  // console.log(node)
  const result = []
  for (let i = 1; i <= 3000; i++) {
    node = node.next!
    // console.log(node.value)
    if (i % 1000 === 0) {
      result.push(node.value)
    }
  }
  console.log(result)
  return result.reduce((a, b) => a + b, 0)
}
// wrong: 3905 too low
// -54
// -13558

export const part2 = () => {}
