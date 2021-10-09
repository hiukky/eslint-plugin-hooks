/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Romullo @hiukky
 */
'use strict'

import { Context, Program, Node } from './types'

export const DEFAULT_GROUPS: string[] = [
  'useReducer',
  'useContext',
  'useState',
  'useRef',
  'useDispatch',
  'useCallback',
  'useEffect',
]

module.exports = {
  meta: {
    docs: {
      description: 'A simple organizer for ordering hooks.',
      category: 'Non-matching declaration order.',
      url: 'https://github.com/hiukky/eslint-plugin-hooks/blob/main/docs/rules/sort.md',
      recommended: false,
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
          },
        },
      },
    ],
  },

  create: (ctx: Context) => {
    const options = ctx.options[0]
    const groups: string[] = options?.groups || DEFAULT_GROUPS

    return {
      Program({ body }: Program) {
        body
          .filter(({ type }) =>
            [
              'FunctionDeclaration',
              'VariableDeclaration',
              'ExportNamedDeclaration',
              'ExportDefaultDeclaration',
            ].includes(type),
          )
          .map(node => {
            let declarations: Node = node

            const isExportableDeclaration = (): boolean =>
              ['ExportNamedDeclaration', 'ExportDefaultDeclaration'].includes(
                node.type,
              )

            if (isExportableDeclaration()) {
              declarations =
                node['declaration']['declarations']?.[0]['init'] ||
                node['declaration']
            } else {
              declarations = node['declarations']?.[0]['init'] || node
            }

            return declarations['body']?.['body']
          })
          .filter(Boolean)
          .forEach((declarations: Node[]) => {
            let nodes: Node[] = []

            declarations.forEach(node => {
              if (node['type'] === 'ExpressionStatement') {
                nodes.push(node['expression'])
              }

              if (node['type'] === 'VariableDeclaration') {
                nodes.push(...node['declarations'])
              }
            })

            const hooks = nodes
              .map(
                ({ type, callee, init }) =>
                  (type === 'CallExpression'
                    ? [type, callee]
                    : type === 'VariableDeclarator'
                    ? [type, init]
                    : []) as [string, Node],
              )
              .filter(node => node.length)
              .map(([type, declaration]) => {
                const getHookName = (): string =>
                  type === 'CallExpression'
                    ? declaration.name
                    : declaration.callee.name

                const getHookNode = (): Node =>
                  type === 'CallExpression' ? declaration : declaration.callee

                return [getHookName(), getHookNode()] as [string, Node]
              })
              .filter(
                ([name]) =>
                  name?.slice(0, 3) === 'use' && groups.includes(name),
              )

            const correctOrdering: [string, Node][] = [...hooks].sort(
              (a, b) => groups.indexOf(a[0]) - groups.indexOf(b[0]),
            )

            hooks.forEach((hook, index) => {
              const noMatching = (): boolean =>
                correctOrdering.length > 1 &&
                correctOrdering[index][0] !== hook[0]

              if (noMatching()) {
                ctx.report(
                  hook[1],
                  `Non-matching declaration order. ${hook[0]} comes ${
                    !index ? 'after' : 'before'
                  } ${correctOrdering[index][0]}.`,
                )
              }
            })
          })
      },
    }
  },
}
