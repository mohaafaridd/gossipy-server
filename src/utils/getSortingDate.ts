import moment from 'moment'
import { DateRange } from '../constants/time'

const getSortingDate = (dateRange: DateRange) => {
  switch (dateRange) {
    case 'TODAY':
      return moment().subtract(1, 'day').toDate()

    case 'THREE_DAYS':
      return moment().subtract(3, 'days').toDate()

    case 'WEEK':
      return moment().subtract(1, 'week').toDate()

    case 'MONTH':
      return moment().subtract(1, 'month').toDate()

    case 'THREE_MONTH':
      return moment().subtract(3, 'months').toDate()

    case 'SIX_MONTH':
      return moment().subtract(6, 'months').toDate()

    case 'YEAR':
      return moment().subtract(1, 'year').toDate()
    default:
      return moment.unix(0).toDate()
  }
}

export default getSortingDate
