const TestRunner = require('test-runner')
const a = require('assert')
const CliApp = require('../lib/cli-app')
const request = require('req-then')
const usage = require('../lib/usage')
usage.disable()

const runner = new TestRunner()

runner.test('cli.run', async function () {
  const port = 7500 + this.index
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--port', `${port}` ]
  const server = CliApp.run()
  process.argv = origArgv
  const response = await request(`http://127.0.0.1:${port}/`)
  server.close()
  a.strictEqual(response.res.statusCode, 404)
})

runner.test('cli.run: bad option', async function () {
  const port = 7500 + this.index
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--should-fail' ]
  const server = CliApp.run()
  process.argv = origArgv
  a.strictEqual(server, undefined)
})