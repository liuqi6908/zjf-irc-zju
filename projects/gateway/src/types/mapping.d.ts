declare enum EsFieldType {
  TEXT = 'text',
  KEYWORD = 'keyword',
  DOUBLE = 'double',
  DATE = 'date',
  GEO_POINT = 'geo_point',
  INTEGER = 'integer',
  NESTED = 'nested',
  BOOLEAN = 'boolean',
}

declare type EsFieldTypes =
  | 'date'
  | 'text'
  | 'keyword'
  | 'double'
  | 'geo_point'
  | 'integer'
  | 'nested';

declare interface EsProperty {
  type: EsFieldType | EsFieldTypes;
  index?: boolean;
  ignore_above?: number;
  format?: string;
  fields?: Record<string, EsProperty>;
  properties?: Record<string, EsProperty>;
}

declare interface EsMapping<K extends string = string> {
  properties: Record<K, EsProperty>;
}
