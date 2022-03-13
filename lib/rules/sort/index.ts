/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Romullo @hiukky
 */

import { Rule } from 'eslint'
import { Program, Node } from './types'

export const DEFAULT_GROUPS: string[] = [
  'useReducer',
  'useContext',
  'useState',
  'useRef',
  'useDispatch',
  'useCallback',
  'useEffect',
]

function takeTokensBeforeWhile(sourceCode, node, condition) {
  const tokens = getTokensOrCommentsBefore(sourceCode, node, 100)
  const result = []
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (condition(tokens[i])) {
      result.push(tokens[i])
    } else {
      break
    }
  }
  return result.reverse()
}

function getTokensOrCommentsAfter(sourceCode, node, count) {
  let currentNodeOrToken = node
  const result = []
  for (let i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken)
    if (currentNodeOrToken == null) {
      break
    }
    // @ts-ignore
    result.push(currentNodeOrToken)
  }
  return result
}

function getTokensOrCommentsBefore(sourceCode, node, count) {
  let currentNodeOrToken = node
  const result = []
  for (let i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken)
    if (currentNodeOrToken == null) {
      break
    }

    // @ts-ignore
    result.push(currentNodeOrToken)
  }
  return result.reverse()
}
function takeTokensAfterWhile(sourceCode, node, condition) {
  const tokens = getTokensOrCommentsAfter(sourceCode, node, 100)
  const result = []
  for (let i = 0; i < tokens.length; i++) {
    if (condition(tokens[i])) {
      result.push(tokens[i])
    } else {
      break
    }
  }
  return result
}
function findEndOfLineWithComments(sourceCode, node) {
  const tokensToEndOfLine = takeTokensAfterWhile(
    sourceCode,
    node,
    commentOnSameLineAs(node),
  )
  const endOfTokens =
    tokensToEndOfLine.length > 0
      ? // @ts-ignore
        tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1]
      : node.range[1]
  let result = endOfTokens
  for (let i = endOfTokens; i < sourceCode.text.length; i++) {
    if (sourceCode.text[i] === '\n') {
      result = i + 1
      break
    }
    if (
      sourceCode.text[i] !== ' ' &&
      sourceCode.text[i] !== '\t' &&
      sourceCode.text[i] !== '\r'
    ) {
      break
    }
    result = i + 1
  }
  return result
}

function commentOnSameLineAs(node) {
  return token =>
    (token.type === 'Block' || token.type === 'Line') &&
    token.loc.start.line === token.loc.end.line &&
    token.loc.end.line === node.loc.end.line
}
function findStartOfLineWithComments(sourceCode, node) {
  const tokensToEndOfLine = takeTokensBeforeWhile(
    sourceCode,
    node,
    commentOnSameLineAs(node),
  )
  const startOfTokens =
    // @ts-ignore
    tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0]
  let result = startOfTokens
  for (let i = startOfTokens - 1; i > 0; i--) {
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
      break
    }
    result = i
  }
  return result
}

function canReorderItems(firstNode, secondNode) {
  const parent = firstNode.parent
  const [firstIndex, secondIndex] = [
    parent.body.indexOf(firstNode),
    parent.body.indexOf(secondNode),
  ].sort()
  const nodesBetween = parent.body.slice(firstIndex, secondIndex + 1)

  return true
}

function findRootNode(node: Node) {
  let parent = node

  // @ts-ignore
  while (parent.parent != null && parent.parent.body == null) {
    // @ts-ignore
    parent = parent.parent
  }
  return parent
}

function makeOutOfOrderReport(
  context: Rule.RuleContext,
  hooks: Node[],
  groups: string[],
) {
  const correctOrdering: Node[] = [...hooks].sort(
    (a, b) => groups.indexOf(a.name) - groups.indexOf(b.name),
  )
  console.log('kek2')
  hooks.forEach((hook, idx) => {
    const noMatching = (): boolean =>
      correctOrdering.length > 1 && correctOrdering[idx].name !== hook.name

    if (noMatching()) {
      context.report({
        // @ts-ignore
        node: hook,
        message: `Non-matching declaration order. ${hook.name} comes ${
          !idx ? 'after' : 'before'
        } ${correctOrdering[idx].name}.`,
        fix: fixer => {
          const sourceCode = context.getSourceCode()
          const firstRoot = findRootNode(hook)
          const firstRootStart = findStartOfLineWithComments(
            sourceCode,
            firstRoot,
          )
          const firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot)

          const secondRoot = findRootNode(correctOrdering[idx])
          const secondRootStart = findStartOfLineWithComments(
            sourceCode,
            secondRoot,
          )
          const secondRootEnd = findEndOfLineWithComments(
            sourceCode,
            secondRoot,
          )
          // const canFix = canReorderItems(firstRoot, secondRoot)

          let newCode = sourceCode.text.substring(
            secondRootStart,
            secondRootEnd,
          )
          if (newCode[newCode.length - 1] !== '\n') {
            newCode = newCode + '\n'
          }

          return fixer.replaceTextRange(
            [firstRootStart, secondRootEnd],
            newCode +
              sourceCode.text.substring(firstRootStart, secondRootStart),
          )
        },
      })
    }
  })
}

module.exports = {
  meta: {
    docs: {
      description: 'A simple organizer for ordering hooks.',
      category: 'Non-matching declaration order.',
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
                node.declaration?.declarations?.[0].init || node.declaration
            } else {
              declarations = node.declarations?.[0].init || node
            }

            return declarations?.body?.body
          })
          .filter(Boolean)
          .forEach((declarations: Node[]) => {
            const nodes: Node[] = []

            declarations.forEach?.(node => {
              if (node.type === 'ExpressionStatement') {
                nodes.push(node.expression)
              }

              if (node.type === 'VariableDeclaration') {
                nodes.push(...node.declarations)
              }
            })

            const hooks = nodes
              ?.map(
                // eslint-disable-next-line no-nested-ternary
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
                    return declaration.callee?.property || declaration.callee
                }
              })
              .filter(Boolean)
              .filter(
                hook =>
                  hook.name?.slice(0, 3) === 'use' &&
                  groups.includes(hook.name),
              )
            makeOutOfOrderReport(ctx, hooks, groups)
            // const correctOrdering: Node[] = [...hooks].sort(
            //   (a, b) => groups.indexOf(a.name) - groups.indexOf(b.name),
            // );

            // // console.log(hooks);
            // hooks.forEach((hook, idx) => {
            //   const noMatching = (): boolean => correctOrdering.length > 1
            //     && correctOrdering[idx].name !== hook.name;

            //   if (noMatching()) {
            //     ctx.report(
            //       hook,
            //       `Non-matching declaration order. ${hook.name} comes ${
            //         !idx ? 'after' : 'before'
            //       } ${correctOrdering[idx].name}.`,
            //     );
            //   }
            // });
          })
      },
    }
  },
}
