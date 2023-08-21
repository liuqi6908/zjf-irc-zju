import { ApiPropertyOptional } from '@nestjs/swagger'
import { decorate } from 'ts-mixer'

const dslMd = `
- 使用 \${} 来引用变量，例如： \`\${F}\`
- 可用的比较关系有：
  | 关系 | 符号 |
  | --- | --- |
  | 等于 | = |
  | 不等于 | != |
  | 大于等于 | >= |
  | 小于等于 | <= |
  | 大于 | > |
  | 小于 | < |
  | 包含（分词搜索） | HAS |
  | 不包含（分词搜索） | NOTHAS |
  | 模糊匹配（匹配短语） | LIKE |
  | 不模糊匹配（匹配短语） | NOTLIKE |
  | 存在 | EXISTS |
  | 不存在 | NOTEXISTS |
  | 在范围内 | IN |
  | 不在范围内 | NOTIN |
  | 为空 | ISNULL |
  | 不为空 | ISNOTNULL |
<br />
- 可用的逻辑关系有：
  | 关系 | 符号 |
  | --- | --- |
  | 且 | AND |
  | 或 | OR |
<br />
- 不同逻辑之间需要用括号括起来，例如： \`(\${F} = 'a' AND \${F} = 'b') OR \${F} = 'c'\`, \`(\${F} = 'a' OR \${F} = 'b') AND \${F} = 'c'\`
- 示例:
  - 过滤登录的用户 \`\${user} ISNOTNULL\`
  - 仅查看数据下载 \`\${action} = 'data:download'\`
  - 同时查看数据下载与预览 \`\${action} IN ('data:download','data:preview')\`
  - 过滤时间  \`\${time} > '2023-08-17'\`
  - 条件组合 \`\${user} ISNOTNULL AND \${action} = 'data:download'\`
  `

export class DslDto {
  @decorate(
    ApiPropertyOptional({
      description: `查询语句${dslMd}`,
      example: '',
      type: () => String,
    }),
  )
  dsl?: string
}
