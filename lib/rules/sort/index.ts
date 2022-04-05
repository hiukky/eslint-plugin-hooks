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
                node['declaration']?.['declarations']?.[0]['init'] ||
                node['declaration']
            } else {
              declarations = node['declarations']?.[0]['init'] || node
            }

            return declarations?.['body']?.['body']
          })
          .filter(Boolean)
          .forEach((declarations: Node[]) => {
            let nodes: Node[] = []

            declarations.forEach?.(node => {
              if (node['type'] === 'ExpressionStatement') {
                nodes.push(node['expression'])
              }

              if (node['type'] === 'VariableDeclaration') {
                nodes.push(...node['declarations'])
              }
            })

            const hooks = nodes
              ?.map(
                ({ type, callee, init }) =>
                  (type === 'CallExpression'
                    ? [type, callee]
                    : type === 'VariableDeclarator'
                    ? [type, init]
                    : []) as [Node['type'], Node],
              )
              .filter(node => node.length === 2)
              .map(([type, declaration]) => {
                switch (type) {
                  case 'MemberExpression':
                    return declaration.property

                  case 'CallExpression':
                    return declaration.type === 'MemberExpression'
                      ? declaration.property
                      : declaration.callee || declaration

                  case 'VariableDeclarator':
                  default:
                    return declaration?.callee?.property || declaration?.callee
                }
              })
              .filter(Boolean)
              .filter(
                hook =>
                  hook.name?.slice(0, 3) === 'use' &&
                  groups.includes(hook.name),
              )

            const correctOrdering: Node[] = [...hooks].sort(
              (a, b) => groups.indexOf(a.name) - groups.indexOf(b.name),
            )

            hooks.forEach((hook, idx) => {
              const noMatching = (): boolean =>
                correctOrdering.length > 1 &&
                correctOrdering[idx].name !== hook.name

              if (noMatching()) {
                ctx.report(
                  hook,
                  `Non-matching declaration order. ${hook.name} comes ${
                    !idx ? 'after' : 'before'
                  } ${correctOrdering[idx].name}.`,
                )
              }
            })
          })
      },
    }
  },
}
