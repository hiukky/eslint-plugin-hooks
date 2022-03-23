/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Romullo @hiukky
 */
'use strict'

import { Rule } from 'eslint'
import { format } from 'prettier'
import { Program, Node, HooksSource, HooksMetadata } from './types'

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
      category: 'Sort',
      url: 'https://github.com/hiukky/eslint-plugin-hooks/blob/main/docs/rules/sort.md',
      recommended: false,
    },
    fixable: 'code',
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

  create: (ctx: Rule.RuleContext) => {
    const source = ctx.getSourceCode()
    const options = ctx.options[0]
    const groups: string[] = options?.groups || DEFAULT_GROUPS

    const trim = (value: string): string => value.split('  ').join('')

    const getCodeText = (metadata: HooksMetadata): string =>
      metadata.comments
        .map(comment => source.getText(comment as any))
        .join('\n')
        .concat('\n', source.getText(metadata.node as any))

    const isExportableDeclaration = (type: Node['type']): boolean =>
      ['ExportNamedDeclaration', 'ExportDefaultDeclaration'].includes(type)

    return {
      Program(program: Program) {
        program.body
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

            if (isExportableDeclaration(node.type)) {
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
            let nodes: HooksSource[] = []

            declarations.forEach?.(node => {
              const rootNode = node as unknown as Rule.Node

              if (node['type'] === 'ExpressionStatement') {
                nodes.push({
                  node,
                  hook: node.expression,
                  comments: source.getCommentsBefore(rootNode),
                })
              }

              if (node['type'] === 'VariableDeclaration') {
                node.declarations.forEach(declaration => {
                  nodes.push({
                    node,
                    hook: declaration.init,
                    comments: source.getCommentsBefore(rootNode),
                  })
                })
              }
            })

            const hooks = nodes
              ?.map(
                ({ hook, node, comments }) =>
                  ({
                    type: hook.type,
                    declaration:
                      hook.type === 'CallExpression'
                        ? hook.callee
                        : hook.type === 'VariableDeclarator'
                        ? hook.init
                        : null,
                    node,
                    comments,
                  } as HooksMetadata),
              )
              .filter(node => node.declaration)
              .map(data => {
                const { declaration } = data

                switch (data.type) {
                  case 'MemberExpression':
                    data.declaration = declaration.property
                    break

                  case 'CallExpression':
                    data.declaration =
                      declaration.type === 'MemberExpression'
                        ? declaration.property
                        : declaration.callee || declaration
                    break

                  case 'VariableDeclarator':
                  default:
                    data.declaration =
                      declaration.callee?.property || declaration.callee
                    break
                }

                return data
              })
              .filter(Boolean)
              .filter(
                ({ declaration }) =>
                  declaration?.name?.slice(0, 3) === 'use' &&
                  groups.includes(declaration.name),
              )

            const correctOrdering: HooksMetadata[] = [...hooks].sort(
              (a, b) =>
                groups.indexOf(a.declaration.name) -
                groups.indexOf(b.declaration.name),
            )

            hooks.forEach((hook, idx) => {
              const noMatching = (): boolean =>
                correctOrdering.length > 1 &&
                correctOrdering[idx].declaration.name !== hook.declaration.name

              if (noMatching()) {
                const node = hook.declaration as unknown as Rule.Node
                const rootNode = program as unknown as Rule.Node

                const hookCodeBad = trim(getCodeText(hook))
                const hookCodeGood = trim(getCodeText(correctOrdering[idx]))

                let newSourceCode = format(
                  trim(source.getText())
                    .replace(hookCodeGood, hookCodeBad)
                    .replace(hookCodeBad, hookCodeGood),
                  // .replace(
                  //   new RegExp(`(${hookCodeBad}|${hookCodeGood})`, 'g'),
                  //   match =>
                  //     match === hookCodeBad ? hookCodeGood : hookCodeBad,
                  // ),
                  {
                    parser: 'babel',
                  },
                )

                console.log('CODE', idx)
                console.log(newSourceCode)

                ctx.report({
                  node,
                  message: `Non-matching declaration order. ${
                    hook.declaration.name
                  } comes ${!idx ? 'after' : 'before'} ${
                    correctOrdering[idx].declaration.name
                  }.`,
                  fix: fixer =>
                    fixer.replaceText(rootNode, newSourceCode.trim()),
                })
              }
            })
          })
      },
    }
  },
}
