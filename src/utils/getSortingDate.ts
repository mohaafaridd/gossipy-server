import * as moment from 'moment'
import { DateRange } from '../constants/time'

export default (dateRange: DateRange) => {
  switch (dateRange) {
    case 'TODAY':
      return moment()
        .subtract(1, 'day')
        .toISOString()

    case 'THREE_DAYS':
      return moment()
        .subtract(3, 'days')
        .toISOString()

    case 'WEEK':
      return moment()
        .subtract(1, 'week')
        .toISOString()

    case 'MONTH':
      return moment()
        .subtract(1, 'month')
        .toISOString()

    case 'THREE_MONTH':
      return moment()
        .subtract(3, 'months')
        .toISOString()

    case 'SIX_MONTH':
      return moment()
        .subtract(6, 'months')
        .toISOString()

    case 'YEAR':
      return moment()
        .subtract(1, 'year')
        .toISOString()
    default:
      break
  }
}
