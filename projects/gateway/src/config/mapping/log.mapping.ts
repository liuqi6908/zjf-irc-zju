export const logMapping: EsMapping = {
  properties: {
    user: {
      type: 'nested',
      properties: {
        id: {
          type: EsFieldType.KEYWORD,
        },
        email: {
          type: EsFieldType.KEYWORD,
        },
        nickname: {
          type: EsFieldType.TEXT,
        },
        account: {
          type: EsFieldType.KEYWORD,
        },
        verification: {
          type: 'nested',
          properties: {
            name: {
              type: EsFieldType.TEXT,
            },
            college: {
              type: EsFieldType.KEYWORD,
            },
            idCard: {
              type: EsFieldType.KEYWORD,
            },
            identify: {
              type: EsFieldType.KEYWORD,
            },
            number: {
              type: EsFieldType.KEYWORD,
            },
            school: {
              type: EsFieldType.KEYWORD,
            },
          },
        },
      },
    },
    action: {
      type: EsFieldType.KEYWORD,
    },
    ip: {
      type: EsFieldType.KEYWORD,
    },
    status: {
      type: EsFieldType.INTEGER,
    },
    targetType: {
      type: EsFieldType.KEYWORD,
    },
    target: {
      type: 'nested',
      properties: {
        id: {
          type: EsFieldType.KEYWORD,
        },
        name: {
          type: EsFieldType.TEXT,
        },
      },
    },
    time: {
      type: EsFieldType.DATE,
    },
  },
}
