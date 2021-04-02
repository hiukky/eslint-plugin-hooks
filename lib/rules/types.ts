export type IOrderHooksOptions = {
  groups: string[]
}

export type ISchemaOptions = IOrderHooksOptions

export type IContext = {
  report(node: any, message: string): void
  options: ISchemaOptions[]
}

export type INode = {
  kind: 'var' | 'let' | 'const'
  declarations: {
    init: {
      type: 'CallExpression'
      callee: {
        name: string
      }
    }
  }[]
}
