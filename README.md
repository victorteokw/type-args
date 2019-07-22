type-args
==============
[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][cov-image]][cov-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-image-dev]][daviddm-url-dev]
[![License][license-image]][license-url]
[![PR Welcome][pr-image]][pr-url]

The node.js options parser that plays well with TypeScript. To fetch the
TypeScript interface from the option rules is extremely hard. However,
type-args tries its best to make coding experience of command line option
parsing more intelligent.

This is a minimalist implementation. And its algorithms are optimized.
It's without annoying command interfaces.

## Installation

Install this package with `npm`.

```bash
npm i type-args -s
```

## Usage

### Define your parsing rules

```typescript
const rules = {
  'help': {
    alias: 'h',
    desc: 'display help.',
    type: 'boolean'
  },
  'version': {
    alias: 'v',
    desc: 'display version.',
    type: 'boolean'
  },
  'verbose': {
    alias: 'V',
    desc: 'verbose output.',
    type: 'boolean',
    default: true
  },
  'files': {
    alias: 'f',
    desc: 'the files to be transformed',
    type: 'string[]'
  }
}
```

The parsing rule is an object with camel cased flag names as keys, and
descriptor objects as values. The descriptor object has 4 values.
* **alias**, single character string as the shortcut of the flag.
* **desc**, a string represents the description of the options.
* **type**, 'boolean' | 'number' | 'string' | 'number[]' | 'string[]'.
* **default**, the default value of the option.

### Parsing ARGV

```typescript
import { parse } from 'type-args';

const [options, args, unknownOptions] = parse(process.argv, rules);
```

* **options** is an object of parsed values.
* **args** is an array of non option tokens.
* **unknownOptions** is an array of undefined flags passed from argv.

### Merging saved options

You can pass unlimited amount of saved options. Imagine you are the author of a
large framework. You read options from `package.json`, from the `.rcfile` and
user command line arguments. You may want merging those together with precedence
like this:

```
default value < package.json < .rcfile < user command line arguments
```

type-args does what you want by accepting the ...third arguments.

## License

MIT © [Zhang Kai Yu][license-url]

[npm-image]: https://img.shields.io/npm/v/type-args.svg?style=flat-square&color=ff69b4&logo=react
[npm-url]: https://npmjs.org/package/type-args
[travis-image]: https://img.shields.io/travis/zhangkaiyulw/type-args.svg?style=flat-square&color=blue&logo=travis
[travis-url]: https://travis-ci.org/zhangkaiyulw/type-args
[cov-image]: https://img.shields.io/codecov/c/github/zhangkaiyulw/type-args/master.svg?style=flat-square&logo=codecov
[cov-url]: https://codecov.io/gh/zhangkaiyulw/type-args
[daviddm-image]: https://img.shields.io/david/zhangkaiyulw/type-args.svg?style=flat-square
[daviddm-url]: https://david-dm.org/zhangkaiyulw/type-args
[daviddm-image-dev]: https://img.shields.io/david/dev/zhangkaiyulw/type-args.svg?style=flat-square
[daviddm-url-dev]: https://david-dm.org/zhangkaiyulw/type-args?type=dev
[license-image]: https://img.shields.io/github/license/zhangkaiyulw/type-args.svg?style=flat-square
[license-url]: https://github.com/zhangkaiyulw/type-args/blob/master/LICENSE
[pr-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[pr-url]: https://github.com/zhangkaiyulw/type-args/blob/master/CONTRIBUTING.md
