/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Hiukky
 */
'use strict'

import { RuleTester, Rule, Linter } from 'eslint'
import * as rule from '@rules/sort'
import { format, Options } from 'prettier'

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

const prettierOptions: Options = {
  parser: 'babel',
}

Tester.run('hooks/sort', rule as unknown as Rule.RuleModule, {
  valid: [
    //   {
    //     code: `
    //     import React from 'react'

    //     export const App = () => {
    //       return <></>
    //     }
    //    `,
    //     parserOptions,
    //     options,
    //   },
    //   {
    //     code: `
    //     import * as React from 'react'
    //     import { useRef } from 'react'

    //     export const ComponentA = () => {
    //       const [count, setCount] = React.useState(0)

    //       const countRef = useRef(0)

    //       React.useEffect(() => {
    //         console.log('Hello')
    //       },[])

    //       return <></>
    //     }
    //    `,
    //     parserOptions,
    //     options,
    //   },
    //   {
    //     code: `
    //     import { useState, useEffect, useReducer } from 'react'

    //     export function ComponentA() {
    //       const [todos, dispatch] = useReducer(todosReducer)

    //       const [count, setCount] = useState(0)

    //       const memoizedCallback = useCallback(() => {
    //         doSomething(a, b);
    //       },[a, b])

    //       useEffect(() => {
    //         document.title = 'Hello'
    //       }, [])
    //     }
    //    `,
    //     parserOptions,
    //     options,
    //   },
    //   {
    //     code: `
    //     import { useState, useEffect, useReducer,useCallback } from 'react'

    //     function ComponentA() {
    //       const [todos, dispatch] = useReducer(todosReducer)

    //       const [count, setCount] = useState(0)

    //       const memoizedCallback = useCallback(() => {
    //         doSomething(a, b);
    //       },[a, b])

    //       useEffect(() => {
    //         document.title = 'Hello'
    //       }, [])
    //     }

    //     const ComponentB = () => {
    //       const [todos, dispatch] = useReducer(todosReducer)

    //       const [count, setCount] = useState(0)

    //       const memoizedCallback = useCallback(() => {
    //         doSomething(a, b);
    //       },[a, b])

    //       useEffect(() => {
    //         document.title = 'Hello'
    //       }, [])
    //     }

    //     export function ComponentC() {
    //       const [todos, dispatch] = useReducer(todosReducer)

    //       const [count, setCount] = useState(0)

    //       const memoizedCallback = useCallback(() => {
    //         doSomething(a, b);
    //       },[a, b])

    //       useEffect(() => {
    //         document.title = 'Hello'
    //       }, [])
    //     }

    //     export const ComponentD = () => {
    //       const [todos, dispatch] = useReducer(todosReducer)

    //       const [count, setCount] = useState(0)

    //       const memoizedCallback = useCallback(() => {
    //         doSomething(a, b);
    //       },[a, b])

    //       useEffect(() => {
    //         document.title = 'Hello'
    //       }, [])
    //     }
    //    `,
    //     parserOptions,
    //     options,
    //   },
    //   {
    //     code: `
    //     export default function ComponentE() {
    //       const [todos, dispatch] = useReducer(todosReducer)

    //       const [count, setCount] = useState(0)

    //       const memoizedCallback = useCallback(() => {
    //         doSomething(a, b);
    //       },[a, b])

    //       useEffect(() => {
    //         document.title = 'Hello'
    //       }, [])
    //     }
    //    `,
    //     parserOptions,
    //     options,
    //   },
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
      }

      export default ComponentA
     `,
      parserOptions,
      options,
    },
  ],
  invalid: [
    // {
    //   code: format(
    //     `
    //     import { useCallback, useEffect, useReducer } from "react";

    //     export const ComponentA = () => {
    //       const [todos, dispatch] = useReducer(
    //         (state, action) => {
    //           switch (action.type) {
    //             default:
    //               return state;
    //           }
    //         },
    //         { count: 0 }
    //       );

    //       useEffect(() => {
    //         document.title = "Hello";
    //       }, []);

    //     const memoizedCallback = useCallback(() => {
    //       console.log("Hello");
    //     }, []);

    //       return null;
    //     };
    //   `,
    //     prettierOptions,
    //   ),
    //   output: format(
    //     `
    //     import { useCallback, useEffect, useReducer } from "react";

    //     export const ComponentA = () => {
    //       const [todos, dispatch] = useReducer(
    //         (state, action) => {
    //           switch (action.type) {
    //             default:
    //               return state;
    //           }
    //         },
    //         { count: 0 }
    //       );

    //       const memoizedCallback = useCallback(() => {
    //         console.log("Hello");
    //       }, []);

    //       useEffect(() => {
    //         document.title = "Hello";
    //       }, []);

    //       return null;
    //     };
    //   `,
    //     prettierOptions,
    //   ),
    //   errors: [
    //     {
    //       message:
    //         'Non-matching declaration order. useEffect comes before useCallback.',
    //     },
    //     {
    //       message:
    //         'Non-matching declaration order. useCallback comes before useEffect.',
    //     },
    //   ],
    //   parserOptions,
    //   options,
    // },
    // {
    //   code: format(
    //     `
    //     import { useCallback, useEffect, useReducer } from "react";

    //     export function ComponentA() {
    //       const memoizedCallback = useCallback(() => {
    //         console.log(count);
    //       }, [count]);

    //       const [count, dispatch] = useReducer(() => 0, 0);

    //       useEffect(() => {
    //         document.title = "Hello";
    //       }, []);
    //     }
    //   `,
    //     prettierOptions,
    //   ),
    //   output: format(
    //     `
    //     import { useCallback, useEffect, useReducer } from "react";

    //     export function ComponentA() {
    //       const [count, dispatch] = useReducer(() => 0, 0);

    //       const memoizedCallback = useCallback(() => {
    //         console.log(count);
    //       }, [count]);

    //       useEffect(() => {
    //         document.title = "Hello";
    //       }, []);
    //     }
    //   `,
    //     prettierOptions,
    //   ),
    //   errors: [
    //     {
    //       message:
    //         'Non-matching declaration order. useCallback comes after useReducer.',
    //     },
    //     {
    //       message:
    //         'Non-matching declaration order. useReducer comes before useCallback.',
    //     },
    //   ],
    //   parserOptions,
    //   options,
    // },
    {
      code: format(
        `
        import { useState, useEffect, useContext,useRef, createContext } from 'react'

        const context = createContext({});

        export function ComponentA() {
          const [count, setCount] = useState(0)
          const locale = useContext(context)
        }

        export function ComponentB() {
          useEffect(() => {
            console.log('Hello')
          }, [])

          const countRef = useRef(0)
        }
        `,
        prettierOptions,
      ),
      // TODO Analyze fixer in multiple components per file scenario.
      output: format(
        `
        import { useState, useEffect, useContext, useRef, createContext } from "react";

        const context = createContext({});

        export function ComponentA() {
          const locale = useContext(context);
          const [count, setCount] = useState(0);
        }

        export function ComponentB() {
          const countRef = useRef(0);

          useEffect(() => {
            console.log("Hello");
          }, []);
        }
        `,
        prettierOptions,
      ),
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
    //   {
    //     code: format(
    //       `
    //     import * as React from 'react'
    //     import { useRef } from 'react'

    //     export const ComponentA = () => {
    //       React.useEffect(() => {
    //         console.log('Hello')
    //       },[])

    //       const countRef = useRef(0)

    //       const [count, setCount] = React.useState(0)

    //       return <></>
    //     }
    //     `,
    //       prettierOptions,
    //     ),
    //     output: format(
    //       `
    //     import * as React from 'react'
    //     import { useRef } from 'react'

    //     export const ComponentA = () => {
    //       const [count, setCount] = React.useState(0)

    //       const countRef = useRef(0)

    //       React.useEffect(() => {
    //         console.log('Hello')
    //       },[])

    //       return <></>
    //     }
    //     `,
    //       prettierOptions,
    //     ),
    //     errors: [
    //       {
    //         message:
    //           'Non-matching declaration order. useEffect comes after useState.',
    //       },
    //       {
    //         message:
    //           'Non-matching declaration order. useState comes before useEffect.',
    //       },
    //     ],
    //     parserOptions,
    //     options,
    //   },
    //   {
    //     code: format(
    //       `
    //     import * as React from 'react'
    //     import { useRef } from 'react'

    //     export const ComponentA = () => {
    //       // Comment
    //       // Anoter comment
    //       React.useEffect(() => {
    //         console.log('Hello')
    //       },[])

    //       const countRef = useRef(0)

    //       /**
    //        * Block
    //        *
    //        *
    //        * Block
    //        *
    //        *
    //        * Block
    //       */
    //       const [count, setCount] = React.useState(0)

    //       return <></>
    //     }`,
    //       prettierOptions,
    //     ),
    //     output: format(
    //       `
    //     import * as React from 'react'
    //     import { useRef } from 'react'

    //     export const ComponentA = () => {
    //       /**
    //        * Block
    //        *
    //        *
    //        * Block
    //        *
    //        *
    //        * Block
    //       */
    //       const [count, setCount] = React.useState(0)

    //       const countRef = useRef(0)

    //       // Comment
    //       // Anoter comment
    //       React.useEffect(() => {
    //         console.log('Hello')
    //       },[])

    //       return <></>
    //     }`,
    //       prettierOptions,
    //     ),
    //     errors: [
    //       {
    //         message:
    //           'Non-matching declaration order. useEffect comes after useState.',
    //       },
    //       {
    //         message:
    //           'Non-matching declaration order. useState comes before useEffect.',
    //       },
    //     ],
    //     parserOptions,
    //     options,
    //   },
  ],
})
