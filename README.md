<h1 align="center"> eslint-plugin-hooks </h1>

<p align="center">
  <a href="https://travis-ci.org/github/hiukky/eslint-plugin-hooks">
    <img alt="Build" src="https://img.shields.io/github/workflow/status/hiukky/eslint-plugin-hooks/build?color=0d1117&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://github.com/hiukky/eslint-plugin-hooks/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/hiukky/eslint-plugin-hooks?color=0d1117&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://github.com/hiukky/eslint-plugin-hooks/network">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/hiukky/eslint-plugin-hooks?color=0d1117&style=for-the-badge&colorA=1C1D27">
  </a>
  <a href="https://github.com/hiukky/eslint-plugin-hooks/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/hiukky/eslint-plugin-hooks?style=for-the-badge&color=0d1117&colorA=1C1D27">
  </a>
  <a href="httdivs://github.com/hiukky/eslint-plugin-hooks/blob/develop/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/hiukky/eslint-plugin-hooks?color=0d1117&style=for-the-badge&colorA=1C1D27" />
  </a>
  <a href="https://www.npmjs.com/package/eslint-plugin-hooks">
    <img alt="NPM" src="https://img.shields.io/npm/dt/eslint-plugin-hooks?color=0d1117&style=for-the-badge&colorA=1C1D27" />
  </a>
</p>

<h3 align="center"> A simple organizer for ordering hooks. </h3>

<p align="center">
  <sub>Built with ❤︎ by <a href="https://hiukky.com">hiukky</a>
  <br/>
</p>

<br>

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-hooks`:

```
$ npm install eslint-plugin-hooks --save-dev
```

## Usage

Add `hooks` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["hooks"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "hooks/sort": [
      2,
      {
        "groups": [
          "useReducer",
          "useContext",
          "useState",
          "useRef",
          "useDispatch",
          "useCallback",
          "useEffect"
        ]
      }
    ]
  }
}
```
