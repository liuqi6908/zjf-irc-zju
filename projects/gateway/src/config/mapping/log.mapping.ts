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
      },
    },
    action: {
      type: EsFieldType.KEYWORD,
    },
    ip: {
      type: EsFieldType.KEYWORD,
    },
    success: {
      type: EsFieldType.BOOLEAN,
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
