const sourceFile = './' + process.argv[2] + '.ts'
const { data } = require(sourceFile)
console.log(data)
require('fs').writeFileSync('./' + process.argv[2] + '.json', JSON.stringify(data))
