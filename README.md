# eslint-plugin-hooks-sort

A simple organizer for ordering hooks.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-hooks-sort`:

```
$ npm install eslint-plugin-hooks-sort --save-dev
```

## Usage

Add `hooks-sort` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["hooks-sort"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "hooks-sort/order": [
      2,
      {
        "groups": [
          "useSelector",
          "useContext",
          "useState",
          "useDispatch",
          "useCallback"
        ]
      }
    ]
  }
}
```
