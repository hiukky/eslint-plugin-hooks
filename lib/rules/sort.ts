/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Romullo @hiukky
 */
'use strict'

import { IContext, INode } from './types'

const DEFAULT_GROUPS = ['useContext', 'useState', 'useEffect']

module.exports = {
  meta: {
    docs: {
      description: 'A simple organizer for ordering hooks.',
      category: 'Non-matching declaration order.',
      url:
        'https://github.com/hiukky/eslint-plugin-hooks/blob/master/docs/rules/sort.md',
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

  create: (ctx: IContext) => {
    const options = ctx.options[0]
    const orderHooks: [string, INode][] = []

    return {
      /**
       * @function VariableDeclaration
       *
       * @param {INode} node
       */
      VariableDeclaration: (node: INode) => {
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
       * @param {INode} node
       */
      'Program:exit': () => {
        var groups: string[] = options?.groups || DEFAULT_GROUPS

        const matchingHooks: [string, INode][] = [...orderHooks].filter(hook =>
          groups.includes(hook[0]),
        )

        const orderHooksCorrect: [string, INode][] = [...matchingHooks].sort(
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
