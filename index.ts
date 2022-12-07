;(async () => {
  const day = process.argv.find(s => s.slice(0, 3) === 'day')
  const Day = await import(`./${day}`)
  console.log(Day.part1())
  console.log(Day.part2())
})()

// run:
// npx ts-node . day1

// run with test data:
// npx ts-node . day1 test
