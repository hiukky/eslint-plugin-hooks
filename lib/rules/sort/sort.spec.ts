/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Hiukky
 */
'use strict'

import { RuleTester, Rule, Linter } from 'eslint'
import * as rule from '@rules/sort'

const Tester = new RuleTester()

const parserOptions: Linter.ParserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
}

const options = [
  {
    groups: rule.DEFAULT_GROUPS,
  },
]

Tester.run('hooks/sort', rule as unknown as Rule.RuleModule, {
  valid: [
    {
      code: `
      import React from 'react'

      export const App = () => {
        return <></>
      }
     `,
      parserOptions,
      options,
    },
    {
      code: `
      import * as React from 'react'
      import { useRef } from 'react'

      export const ComponentA = () => {
        const [count, setCount] = React.useState(0)

        const countRef = useRef(0)

        React.useEffect(() => {
          console.log('Hello')
        },[])

        return null
      }
     `,
      parserOptions,
      options,
    },
    {
      code: `
      import { useState, useEffect, useReducer } from 'react'

      export function ComponentA() {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }
     `,
      parserOptions,
      options,
    },
    {
      code: `
      import { useState, useEffect, useReducer,useCallback } from 'react'

      function ComponentA() {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }

      const ComponentB = () => {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }

      export function ComponentC() {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }

      export const ComponentD = () => {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }
     `,
      parserOptions,
      options,
    },
    {
      code: `
      export default function ComponentE() {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }
     `,
      parserOptions,
      options,
    },
    {
      code: `
      function ComponentA() {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        return null
      }

      export default ComponentA
     `,
      parserOptions,
      options,
    },
    {
      code: `
      var variableInitialized = null

      function ComponentA() {
        const [todos, dispatch] = useReducer(todosReducer)

        const [count, setCount] = useState(0)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b);
        },[a, b])

        useEffect(() => {
          document.title = 'Hello'
        }, [])

        let uninitializedVariable

        return null
      }

      export default ComponentA
     `,
      parserOptions,
      options,
    },
  ],
  invalid: [
    {
      code: `
      import { useState, useEffect, useReducer } from 'react'

      export function ComponentA() {
        useEffect(() => {
          document.title = 'Hello'
        }, [])

        const [todos, dispatch] = useReducer(todosReducer)

        const memoizedCallback = useCallback(() => {
          doSomething(a, b)
        }, [a, b])

        return null
      }
      `,
      errors: [
        {
          message:
            'Non-matching declaration order. useEffect comes after useReducer.',
        },
        {
          message:
            'Non-matching declaration order. useReducer comes before useCallback.',
        },
        {
          message:
            'Non-matching declaration order. useCallback comes before useEffect.',
        },
      ],
      parserOptions,
      options,
    },
    {
      code: `
      import { useState, useEffect, useContext,useRef } from 'react'

      export function ComponentA() {
        const [count, setCount] = useState(0)
        const locale = useContext(LocaleContext)

        return null
      }

      export function ComponentB() {
        useEffect(() => {
          console.log('Hello')
        }, [])

        const countRef = useRef(0)

        return null
      }
      `,
      errors: [
        {
          message:
            'Non-matching declaration order. useState comes after useContext.',
        },
        {
          message:
            'Non-matching declaration order. useContext comes before useState.',
        },
        {
          message:
            'Non-matching declaration order. useEffect comes after useRef.',
        },
        {
          message:
            'Non-matching declaration order. useRef comes before useEffect.',
        },
      ],
      parserOptions,
      options,
    },
    {
      code: `
      import * as React from 'react'
      import { useRef } from 'react'

      export const ComponentA = () => {
        React.useEffect(() => {
          console.log('Hello')
        },[])

        const countRef = useRef(0)

        const [count, setCount] = React.useState(0)

        return null
      }
      `,
      errors: [
        {
          message:
            'Non-matching declaration order. useEffect comes after useState.',
        },
        {
          message:
            'Non-matching declaration order. useState comes before useEffect.',
        },
      ],
      parserOptions,
      options,
    },
    {
      code: `
      import * as React from 'react'
      import { useRef } from 'react'

      var variableInitialized = null

      export const ComponentA = () => {
        React.useEffect(() => {
          console.log('Hello')
        },[])

        const countRef = useRef(0)

        const [count, setCount] = React.useState(0)

        let uninitializedVariable

        return null
      }
      `,
      errors: [
        {
          message:
            'Non-matching declaration order. useEffect comes after useState.',
        },
        {
          message:
            'Non-matching declaration order. useState comes before useEffect.',
        },
      ],
      parserOptions,
      options,
    },
  ],
})
