export const logDataMapping: EsMapping = {
  properties: {
    user: {
      type: EsFieldType.NESTED,
      properties: {
        id: {
          type: EsFieldType.KEYWORD,
        },
        email: {
          type: EsFieldType.KEYWORD,
        },
        nickname: {
          type: EsFieldType.TEXT,
          fields: {
            keyword: {
              type: EsFieldType.KEYWORD,
            },
          },
        },
        account: {
          type: EsFieldType.KEYWORD,
        },
        verification: {
          type: EsFieldType.NESTED,
          properties: {
            name: {
              type: EsFieldType.TEXT,
              fields: {
                keyword: {
                  type: EsFieldType.KEYWORD,
                },
              },
            },
            college: {
              type: EsFieldType.TEXT,
              fields: {
                keyword: {
                  type: EsFieldType.KEYWORD,
                },
              },
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
              type: EsFieldType.TEXT,
              fields: {
                keyword: {
                  type: EsFieldType.KEYWORD,
                },
              },
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
    target: {
      type: EsFieldType.NESTED,
      properties: {
        rootId: {
          type: EsFieldType.KEYWORD,
        },
        dbId: {
          type: EsFieldType.KEYWORD,
        },
        subDbId: {
          type: EsFieldType.KEYWORD,
        },
        moduleId: {
          type: EsFieldType.KEYWORD,
        },
        tableId: {
          type: EsFieldType.KEYWORD,
        },
      },
    },
    time: {
      type: EsFieldType.DATE,
    },
  },
}
