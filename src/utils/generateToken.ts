import * as jwt from 'jsonwebtoken'

export default userId =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30 days',
  })
