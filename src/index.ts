import server from './server'
import chalk from 'chalk'

server.start(() =>
  console.log(`Your server has been ${chalk.green.bold('Enabled ♥')}`)
)
