import '@babel/polyfill/noConflict'
import server from '../../src/server'

export default async () => {
  //@ts-ignore
  global.httpServer = await server.start({ port: 4000 })
}
