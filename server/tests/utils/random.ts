import { Chance } from 'chance'
import config from '@server/config'

// Chance is a lightweight fake data generator.
// It is needed to use the same seed
// every time to make the tests deterministic.
export const random = config.isCi ? Chance(1) : Chance()
