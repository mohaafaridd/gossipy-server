import * as jwt from 'jsonwebtoken'

const generateToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30 days',
  })

export default generateToken
