export default (jwt: string = '') => ({
  req: {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  },
})
