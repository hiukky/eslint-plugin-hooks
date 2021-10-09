export type Node = {
  type:
    | 'FunctionDeclaration'
    | 'VariableDeclaration'
    | 'ExportNamedDeclaration'
    | 'ExportDefaultDeclaration'
    | 'ExpressionStatement'
    | 'VariableDeclaration'
    | 'CallExpression'
    | 'VariableDeclarator'
  name: string
  body: {
    body: any[]
  }
  init: Node[]
  callee: Node
  expression: Node
  declaration: {
    declarations: {
      init: Node
    }[]
  }
  declarations: {
    init: Node
  }[] &
    Node[]
}

export type Program = {
  body: Node[]
}

export type Options = {
  groups: string[]
}

export type Context = {
  report(node: Node, message: string): void
  options: Options[]
}
