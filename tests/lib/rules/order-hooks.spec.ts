/**
 * @fileoverview A simple organizer for ordering hooks.
 * @author Hiukky
 */
'use strict'

import { RuleTester } from 'eslint'
import rule from '../../../lib/rules/order-hooks'

const Tester = new RuleTester()

Tester.run('order-hooks', rule, {
  valid: [
    'const { signIn, setManagerToken } = useContext(AuthContext)',
    'const [selectedCompanies, setSelectedCompanies] = useState([])',
    'const { setColors } = useContext(ThemeContext)',
    'const [inputValue, setInputValue] = useState()',
    'const dispatch = useDispatch()',
  ],
  invalid: [
    {
      code: 'var signIn = useContext()',
      errors: [
        {
          message: 'Dont use order for hook.',
          type: 'VariableDeclaration',
        },
      ],
    },
  ],
})
