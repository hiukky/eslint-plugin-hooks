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
      category: 'Fill me in',
      recommended: false,
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            default: [],
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
        const orderHooksCorrect: [string, TNode][] = [...orderHooks].sort(
          (a, b) => options.groups.indexOf(a[0]) - options.groups.indexOf(b[0]),
        )

        orderHooks.filter((hook, index) => {
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
