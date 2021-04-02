# A simple organizer for ordering hooks. (sort)

Please describe the origin of the rule here.

## Rule Details

This rule warns about the incorrect order of calling hooks based on your definitions. For example the groups are defined respectively `["useContext", "useState"]` and in your code has a code snippet in which the `useState` hook is called before the `useContext` hook, you will receive the attention or error notification for the incorrect order of calls.

Examples of **incorrect** code for this rule:

```js
/**
 *  "hooks/sort": [
 *    2,
 *    {
 *      "groups": [
 *        "useContext",
 *        "useState",
 *      ]
 *    }
 *  ]
 */
import { useContext, useState } from 'react'

// 👎
const [state, setState] = useState()
const { foo } = useContext()
```

Examples of **correct** code for this rule:

```js
/**
 *  "hooks/sort": [
 *    2,
 *    {
 *      "groups": [
 *        "useContext",
 *        "useState",
 *      ]
 *    }
 *  ]
 */
import { useContext, useState } from 'react'

// 👍
const { foo } = useContext()
const [state, setState] = useState()
```
