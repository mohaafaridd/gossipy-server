import '@types/jest'

import seed from './seed'

beforeEach(seed, 30000)

test('should seed the production database', () => {})
