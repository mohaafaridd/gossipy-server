import 'module-alias/register'

import server from './server'
import chalk from 'chalk'

server
  .listen()
  .then(({ port }) =>
    console.log(
      `Server is ${chalk.blueBright.bold(
        'Enabled'
      )} on port ${chalk.blueBright.bold(port)}`
    )
  )
