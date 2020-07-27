/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Hiukky
 */
'use strict'

import { TContext, TNode } from './types'

module.exports = {
  meta: {
    docs: {
      description: 'A simple organizer for ordering hooks.',
      category: 'Non-matching declaration order.',
      url:
        'https://github.com/hiukky/eslint-plugin-hooks-sort/blob/master/docs/rules/order-hooks.md',
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

  create: (ctx: TContext) => {
    const options = ctx.options[0]
    const orderHooks: [string, TNode][] = []

    return {
      /**
       * @function VariableDeclaration
       *
       * @param {TNode} node
       */
      VariableDeclaration: (node: TNode) => {
        const declaration = node.declarations[0].init

        if (
          declaration?.type === 'CallExpression' &&
          node.kind === 'const' &&
          declaration.callee.name
        ) {
          if (declaration.callee.name.slice(0, 3) === 'use') {
            orderHooks.push([declaration.callee.name, node])
          }
        }
      },

      /**
       * @function Program
       *
       * @param {TNode} node
       */
      'Program:exit': () => {
        var groups: string[] = options?.groups || [
          'useContext',
          'useState',
          'useEffect',
        ]

        const matchingHooks: [string, TNode][] = [...orderHooks].filter(hook =>
          groups.includes(hook[0]),
        )

        const orderHooksCorrect: [string, TNode][] = [...matchingHooks].sort(
          (a, b) => groups.indexOf(a[0]) - groups.indexOf(b[0]),
        )

        matchingHooks.filter((hook, index) => {
          if (
            orderHooksCorrect.length > 1 &&
            orderHooksCorrect[index][0] !== hook[0]
          ) {
            ctx.report(
              hook[1],
              `Non-matching declaration order. ${hook[0]} comes ${
                !index ? 'after' : 'before'
              } ${orderHooksCorrect[index][0]}.`,
            )
          }
        })
      },
    }
  },
}
