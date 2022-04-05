import { Comment } from 'estree'

export type Node = {
  type:
    | 'Identifier'
    | 'FunctionDeclaration'
    | 'VariableDeclaration'
    | 'ExportNamedDeclaration'
    | 'ExportDefaultDeclaration'
    | 'ExpressionStatement'
    | 'VariableDeclaration'
    | 'CallExpression'
    | 'VariableDeclarator'
    | 'MemberExpression'
  name: string
  body: {
    body: any[]
  }
  init: Node[]
  callee: Node
  expression: Node
  property: Node
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

export type HooksSource = {
  node: Node
  hook: Node
  comments: Comment[]
}

export type HooksMetadata = {
  type: Node['type']
  declaration: Node
} & Pick<HooksSource, 'node' | 'comments'>
