import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function withoutCharacters(value: any, allowedCharacters: string) {
  return !value.split('').some((char: string) => {
    const isNumOrLetter = /[0-9a-zA-Z]/.test(char)
    const isAllowed = allowedCharacters.includes(char)
    return !isNumOrLetter && !isAllowed
  })
}

export function WithoutCharacters(allowedCharacters = '', validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'withoutCharacters',
      target: object.constructor,
      propertyName,
      options: {
        message: `不得包含${allowedCharacters ? `${allowedCharacters} 以外的` : ''}特殊字符`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return withoutCharacters(value, allowedCharacters)
        },
      },
    })
  }
}
