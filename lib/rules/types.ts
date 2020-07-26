export type TOrderHooksOptions = {
  groups: string[]
}

export type TSchemaOptions = TOrderHooksOptions

export type TContext = {
  report(node: any, message: string): void
  options: TSchemaOptions[]
}

export type TNode = {
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
