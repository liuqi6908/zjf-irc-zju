import { esHelper } from './es-helper'
import { fillZero } from './fill-zero'

export function esInRangeAndAliveInRange(
  rangeStart: string,
  rangeEnd: string,
  esdateField: string,
  deadateField: string,
) {
  return esHelper.and([
    esHelper.ranges(esdateField, { '>=': rangeStart, '<': rangeEnd }),
    esHelper.or([
      esHelper.not(esHelper.exists(deadateField)),
      esHelper.ranges(deadateField, { '>=': rangeEnd }),
    ]),
  ])
}

/**
 * 在指定日期范围内成立，且至今存活
 * @param rangeStart
 * @param rangeEnd
 * @param esdateField
 * @param deadateField
 */
export function esInRangeAndAliveNow(
  rangeStart: string,
  rangeEnd: string,
  esdateField: string,
  deadateField: string,
) {
  return esHelper.and([
    esHelper.ranges(esdateField, { '>=': rangeStart, '<': rangeEnd }),
    esHelper.not(esHelper.exists(deadateField)),
  ])
}
export function esBeforeAndAliveInRange(
  _rangeStart: string,
  rangeEnd: string,
  esdateField: string,
  deadateField: string,
) {
  return esHelper.and([
    esHelper.ranges(esdateField, { '<': rangeEnd }),
    esHelper.or([
      esHelper.not(esHelper.exists(deadateField)),
      esHelper.ranges(deadateField, { '>=': rangeEnd }),
    ]),
  ])
}

export function aggDateRange(
  rangeStart: string,
  rangeEnd: string,
  dateField: string,
) {
  return esHelper.ranges(dateField, { '>=': rangeStart, '<': rangeEnd })
}

export function ljDateRange(
  _rangeStart: string,
  rangeEnd: string,
  dateField: string,
) {
  return esHelper.ranges(dateField, { '<': rangeEnd })
}

export function dateRangeBuilder(
  range: 'year' | 'quarter' | 'month' | 'day' | 'hour' | 'minute',
  years: number[],
  filterBuilder: (rangeStart: string, rangeEnd: string) => Record<string, any>,
) {
  const ys = [{ y: '', v: 0 }]
  const months = [
    { m: '01', v: 1 },
    { m: '02', v: 2 },
    { m: '03', v: 3 },
    { m: '04', v: 4 },
    { m: '05', v: 5 },
    { m: '06', v: 6 },
    { m: '07', v: 7 },
    { m: '08', v: 8 },
    { m: '09', v: 9 },
    { m: '10', v: 10 },
    { m: '11', v: 11 },
    { m: '12', v: 12 },
  ]
  const quarters = [
    { q: 'Q1', v: 1 },
    { q: 'Q2', v: 2 },
    { q: 'Q3', v: 3 },
    { q: 'Q4', v: 4 },
  ]

  if (range === 'year') {
    return years
      .flatMap((year) => {
        return ys.map((y) => {
          return { year, value: `${year}${y.y}` }
        })
      })
      .reduce((prev, yearObj) => {
        const { year } = yearObj
        const fromDate = `${year}-01-01`
        const toDate = `${year + 1}-01-01`
        return {
          ...prev,
          [year]: filterBuilder(fromDate, toDate),
        }
      }, {})
  }
  else if (range === 'quarter') {
    return years
      .flatMap((year) => {
        return quarters.map((quatar) => {
          return { year, value: `${year}${quatar.q}`, q: quatar.v }
        })
      })
      .reduce((prev, curr) => {
        const { year, q, value } = curr
        const fromDate = `${year}-${
          q === 1 ? '01' : q === 2 ? '04' : q === 3 ? '07' : '10'
        }-01`
        const toDate = `${q === 4 ? year + 1 : year}-${
          q === 1 ? '04' : q === 2 ? '07' : q === 3 ? '10' : '01'
        }-01`
        return {
          ...prev,
          [value]: filterBuilder(fromDate, toDate),
        }
      }, {})
  }
  else if (range === 'month') {
    return years
      .flatMap((year) => {
        return months.map((month) => {
          return { year, value: `${year}${month.m}`, m: month.v }
        })
      })
      .reduce((prev, curr) => {
        const { year, m, value } = curr
        const fromDate = `${year}-${fillZero(m, 2)}-01`
        const toDate = `${m === 12 ? year + 1 : year}-${
          m === 12 ? '01' : fillZero(m + 1, 2)
        }-01`
        return {
          ...prev,
          [value]: filterBuilder(fromDate, toDate),
        }
      }, {})
  }
}

export function aggDateRangesFilters(type: 'esInRangeAndAliveInRange' | 'esBeforeAndAliveInRange',
  esdateField: string,
  deadateField: string,
  years: number[],
  range: 'year' | 'quarter' | 'month' = 'year') {
  const handler
    = type === 'esInRangeAndAliveInRange'
      ? esInRangeAndAliveInRange
      : esBeforeAndAliveInRange

  const rangeBuilder = (rangeStart: string, rangeEnd: string) => {
    return handler(rangeStart, rangeEnd, esdateField, deadateField)
  }
  return dateRangeBuilder(range, years, rangeBuilder)
}
