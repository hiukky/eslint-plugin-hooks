/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Hiukky
 */
'use strict'

export default {
  meta: {
    docs: {
      description: 'A simple organizer for ordering hooks.',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: undefined,
    schema: [],
  },

  create: (context: any) => {
    console.log({ context })

    return {
      VariableDeclaration: (node: any) => {
        console.log(node)
      },
    }
  },
}
