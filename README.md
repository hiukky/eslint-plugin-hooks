<h1 align="center"> eslint-plugin-hooks-sort </h1>

<p align="center">
  <a href="https://travis-ci.org/github/hiukky/eslint-plugin-hooks-sort">
    <img alt="Travis (.org) branch" src="https://img.shields.io/travis/hiukky/eslint-plugin-hooks-sort/develop?color=%2323d18c&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://codecov.io/gh/hiukky/eslint-plugin-hooks-sort">
    <img alt="Codecov branch" src="https://img.shields.io/codecov/c/github/hiukky/eslint-plugin-hooks-sort/develop?color=%23ff5d8f&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://github.com/hiukky/eslint-plugin-hooks-sort/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/hiukky/eslint-plugin-hooks-sort?color=%2300cecb&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://github.com/hiukky/eslint-plugin-hooks-sort/network">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/hiukky/eslint-plugin-hooks-sort?color=%23a29bfe&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://github.com/hiukky/eslint-plugin-hooks-sort/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/hiukky/eslint-plugin-hooks-sort?style=for-the-badge&color=ffe066&colorA=1C1D27">
  </a>
  <a href="httdivs://github.com/hiukky/eslint-plugin-hooks-sort/blob/develop/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/hiukky/eslint-plugin-hooks-sort?color=%23eab464&style=for-the-badge&colorA=1C1D27" />
  </a>
  <a href="https://www.npmjs.com/package/eslint-plugin-hooks-sort">
    <img alt="NPM" src="https://img.shields.io/npm/dt/eslint-plugin-hooks-sort?color=%23f49e4c&style=for-the-badge&colorA=1C1D27" />
  </a>
</p>

<h3 align="center"> A simple organizer for ordering hooks. </h3>

<p align="center">
  <sub>Built with ❤︎ by <a href="https://hiukky.com">Hiukky</a>
  <br/>
</p>

<br>

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
