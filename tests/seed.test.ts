import { PrismaClient, UserUpdateInput } from '@prisma/client'
import seed from './seed'
beforeAll(
  () =>
    seed({
      User: true,
      Comment: true,
      Membership: true,
      Station: true,
      Topic: true,
      Vote: true,
    }),
  60000
)

test('should seed', () => {})
