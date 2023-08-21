export const esHelper = {
  and(andQueries, otherBools = {}) {
    return {
      bool: { must: andQueries.filter(q => !!q), ...otherBools },
    }
  },
  or(orQueries, otherBools = {}) {
    return {
      bool: { should: orQueries.filter(q => !!q), ...otherBools },
    }
  },
  not(notQuery, otherBools = {}) {
    return { bool: { must_not: notQuery, ...otherBools } }
  },
  term(field, value) {
    return { term: { [field]: value } }
  },
  terms(field, values) {
    return { terms: { [field]: values } }
  },
  range(field, rangeType, value) {
    return {
      range: {
        [field]: {
          [rangeType === '<='
            ? 'lte'
            : rangeType === '>='
              ? 'gte'
              : rangeType === '<'
                ? 'lt'
                : 'gt']: value,
        },
      },
    }
  },
  ranges(field, ranges) {
    return {
      range: {
        [field]: Object.entries(ranges).reduce((acc, [rangeType, value]) => {
          return {
            ...acc,
            ...this.range(field, rangeType, value).range[field],
          }
        }, {}),
      },
    }
  },
  match(field, value, minimum_should_match = '100%') {
    return { match: { [field]: { query: value, minimum_should_match } } }
  },
  matchPhrase(field, value) {
    return { match_phrase: { [field]: value } }
  },
  exists(field) {
    return { exists: { field } }
  },
  nested(path, query) {
    return { nested: { path, query } }
  },
  matchAll() {
    return { match_all: {} }
  },
}
