import server from './server'
import chalk from 'chalk'

// server.start(() =>
//   console.log(`Your server has been ${chalk.green.bold('Enabled ♥')}`)
// )

server
  .listen()
  .then(({ url, port }) => console.log(`THE SERVER IS UP ON PORT ${port}`))
