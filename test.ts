import { parse } from './src/index';

describe('does parsing', () => {
  it('puts known options into the first return value', () => {
    const [options, args, unknownOptions] = parse(
      ['--silent', '-c', 'memory'],
      {
        'silent': {
          alias: 's',
          desc: 'silent output.',
          type: 'boolean'
        },
        'cache': {
          alias: 'c',
          desc: 'where to cache data.',
          type: 'string'
        }
      }
    )
    expect(options).toEqual({
      silent: true,
      cache: 'memory'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('puts arg tokens into the second return value', () => {
    const [options, args, unknownOptions] = parse(
      ['token1', 'token2'],
      {}
    )
    expect(options).toEqual({});
    expect(args).toEqual(['token1', 'token2']);
    expect(unknownOptions).toEqual([]);
  });

  it('puts unknown options into the third return value', () => {
    const [options, args, unknownOptions] = parse(
      ['--i-am-unknown', '-v'],
      {
        'silent': {
          alias: 's',
          desc: 'silent output.',
          type: 'boolean'
        },
        'cache': {
          alias: 'c',
          desc: 'where to cache data.',
          type: 'string'
        }
      }
    )
    expect(options).toEqual({});
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual(['--i-am-unknown', '-v']);
  });

  it('puts correct tokens into correct return values', () => {
    const [options, args, unknownOptions] = parse(
      ['resource', '--orm', 'typeorm', '--silent', 'User', '--wrongly'],
      {
        'orm': {
          alias: 'o',
          desc: 'which orm to use.',
          type: 'string'
        },
        'silent': {
          alias: 's',
          desc: 'whether silent output.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      orm: 'typeorm',
      silent: true
    });
    expect(args).toEqual(['resource', 'User']);
    expect(unknownOptions).toEqual(['--wrongly']);
  });

});

describe('supported value types', () => {
  it('boolean without following argument', () => {
    const [options, args, unknownOptions] = parse(
      ['--stars', '-q'],
      {
        'stars': {
          alias: 's',
          desc: 'do you like stars?',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'quiet watching.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      stars: true,
      quiet: true,
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it("boolean with prefixed 'no'", () => {
    const [options, args, unknownOptions] = parse(
      ['output', '--no-verbose'],
      {
        'verbose': {
          alias: 'V',
          desc: 'verbose output.',
          type: 'boolean',
          default: true
        }
      }
    );
    expect(options).toEqual({
      'verbose': false
    });
    expect(args).toEqual(['output']);
    expect(unknownOptions).toEqual([]);
  });

  it('boolean with rhs true', () => {
    const [options, args, unknownOptions] = parse(
      ['seed', '--verbose=true', '--dry-run=true'],
      {
        'verbose': {
          alias: 'V',
          desc: 'verbose output.',
          type: 'boolean'
        },
        'dryRun': {
          alias: 'd',
          desc: 'only dry run.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      'verbose': true,
      'dryRun': true
    });
    expect(args).toEqual(['seed']);
    expect(unknownOptions).toEqual([]);
  });

  it('boolean with rhs false', () => {
    const [options, args, unknownOptions] = parse(
      ['--stars=false', '--moon=false'],
      {
        'stars': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'moon': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      'stars': false,
      'moon': false
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it("boolean with any value that not equal to 'false'", () => {
    const [options, args, unknownOptions] = parse(
      ['--stars=shape', '--moon=circular'],
      {
        'stars': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'moon': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      'stars': true,
      'moon': true
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with rhs hexadecimal value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish=0x522', '--hippocampus=0x400'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 0x522,
      'hippocampus': 0x400
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with rhs decimal value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish=1314', '--hippocampus=1024'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 1314,
      'hippocampus': 1024
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with rhs octal value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish=0o2442', '--hippocampus=0o2000'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 0o2442,
      'hippocampus': 0o2000
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with rhs binary value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish=0b10100100010', '--hippocampus=0b10000000000'],
      {
        'starfish': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 0b10100100010,
      'hippocampus': 0b10000000000
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with rhs negative value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish=-1314', '--hippocampus=-1024'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': -1314,
      'hippocampus': -1024
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with following hexadecimal value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish', '0x522', '--hippocampus', '0x400'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 0x522,
      'hippocampus': 0x400
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with following decimal value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish', '1314', '--hippocampus', '1024'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 1314,
      'hippocampus': 1024
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with following octal value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish', '0o2442', '--hippocampus', '0o2000'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 0o2442,
      'hippocampus': 0o2000
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with following binary value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish', '0b10100100010', '--hippocampus', '0b10000000000'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': 0b10100100010,
      'hippocampus': 0b10000000000
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number with following negative value', () => {
    const [options, args, unknownOptions] = parse(
      ['--starfish', '-1314', '--hippocampus', '-1024'],
      {
        'starfish': {
          alias: 's',
          desc: 'who is starfish.',
          type: 'number'
        },
        'hippocampus': {
          alias: 'h',
          desc: 'what is hippocampus.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      'starfish': -1314,
      'hippocampus': -1024
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('string with rhs value', () => {
    const [options, args, unknownOptions] = parse(
      ['--city=paris', '--country=france'],
      {
        'city': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'string'
        },
        'country': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      'city': 'paris',
      'country': 'france'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('string with following value', () => {
    const [options, args, unknownOptions] = parse(
      ['--city', 'paris', '--country', 'france'],
      {
        'city': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'string'
        },
        'country': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      'city': 'paris',
      'country': 'france'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('number array with multiple following values', () => {
    const [options, args, unknownOptions] = parse(
      ['--date', '1314', '1024', '-n', '9527', '777'],
      {
        'date': {
          alias: 'd',
          desc: 'the magic dates.',
          type: 'number[]'
        },
        'number': {
          alias: 'n',
          desc: 'the magic numbers.',
          type: 'number[]'
        }
      }
    );
    expect(options).toEqual({
      'date': [1314, 1024],
      'number': [9527, 777]
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('string array with multiple following values', () => {
    const [options, args, unknownOptions] = parse(
      ['-c', 'Paris', 'London', '--country', 'France', 'UK'],
      {
        'city': {
          alias: 'c',
          desc: 'cities list.',
          type: 'string[]'
        },
        'country': {
          alias: 'C',
          desc: 'countries list.',
          type: 'string[]'
        }
      }
    );
    expect(options).toEqual({
      'city': ['Paris', 'London'],
      'country': ['France', 'UK']
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });
});

describe('supported flag types', () => {
  it('flag with two dashes', () => {
    const [options, args, unknownOptions] = parse(
      ['--yesterday'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      yesterday: true
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('flag with single dash', () => {
    const [options, args, unknownOptions] = parse(
      ['-q', 'three'],
      {
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      quiet: 'three'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('flag with multiple alias in single dash', () => {
    const [options, args, unknownOptions] = parse(
      ['-hvs', 'three'],
      {
        'help': {
          alias: 'h',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'version': {
          alias: 'v',
          desc: 'the quiet one.',
          type: 'boolean'
        },
        'silent': {
          alias: 's',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      help: true,
      version: true,
      silent: 'three'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });
});

describe('copies default values for undefined options', () => {
  it('sets true for boolean field', () => {
    const [options, args, unknownOptions] = parse(
      ['--orms', 'mongoose', 'sequelize'],
      {
        'copyValue': {
          alias: 'c',
          desc: 'whether to copy value.',
          type: 'boolean',
          default: true
        },
        'orms': {
          alias: 'o',
          desc: 'supported orms.',
          type: 'string[]'
        }
      }
    );
    expect(options).toEqual({
      copyValue: true,
      orms: ['mongoose', 'sequelize']
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('sets false for boolean field', () => {
    const [options, args, unknownOptions] = parse(
      ['model', '--email'],
      {
        'withUpload': {
          alias: 'u',
          desc: 'whether create paired uploader.',
          type: 'boolean',
          default: false
        }
      }
    );
    expect(options).toEqual({
      withUpload: false
    });
    expect(args).toEqual(['model']);
    expect(unknownOptions).toEqual(['--email']);
  });

  it('sets empty string for string value', () => {
    const [options, args, unknownOptions] = parse(
      ['react-native', '--electron'],
      {
        'flutter': {
          alias: 'f',
          desc: 'Flutter is Google\'s portable UI toolkit for crafting beautiful.',
          type: 'string',
          default: ''
        }
      }
    );
    expect(options).toEqual({
      flutter: ''
    });
    expect(args).toEqual(['react-native']);
    expect(unknownOptions).toEqual(['--electron']);
  });

  it('sets nonempty string for string value', () => {
    const [options, args, unknownOptions] = parse(
      ['server', '--help', '--nginx'],
      {
        'framework': {
          alias: 'f',
          desc: 'which framework to use.',
          type: 'string',
          default: 'koa'
        },
        'help': {
          alias: 'h',
          desc: 'display help.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      framework: 'koa',
      help: true
    });
    expect(args).toEqual(['server']);
    expect(unknownOptions).toEqual(['--nginx']);
  });

  it('sets 0 for number value', () => {
    const [options, args, unknownOptions] = parse(
      ['out'],
      {
        'level': {
          alias: 'l',
          desc: 'output level.',
          type: 'number',
          default: 0
        }
      }
    );
    expect(options).toEqual({
      level: 0
    });
    expect(args).toEqual(['out']);
    expect(unknownOptions).toEqual([]);
  });

  it('sets positive number for value', () => {
    const [options, args, unknownOptions] = parse(
      ['css', 'html'],
      {
        'javascript': {
          alias: 'e',
          desc: ' constantly updated javascript.',
          type: 'number',
          default: 2018
        }
      }
    );
    expect(options).toEqual({
      javascript: 2018
    });
    expect(args).toEqual(['css', 'html']);
    expect(unknownOptions).toEqual([]);
  });

  it('sets negative number for value', () => {
    const [options, args, unknownOptions] = parse(
      ['humidity', '--decibel'],
      {
        'centigrade': {
          alias: 'y',
          desc: 'It\'s really cold here.',
          type: 'number',
          default: -10
        },
      }
    );
    expect(options).toEqual({
      centigrade: -10
    });
    expect(args).toEqual(['humidity']);
    expect(unknownOptions).toEqual(['--decibel']);
  });
});

describe('merges provided options', () => {
  it('the latter has precedence over the former', () => {
    const [options, args, unknownOptions] = parse(
      [],
      {
        useTypeScript: {
          desc: 'whether uses TypeScript.',
          type: 'boolean'
        },
        useKoa: {
          desc: 'whether uses Koa.',
          type: 'boolean'
        },
        useJsx: {
          desc: 'whether uses JSX.',
          type: 'boolean'
        }
      },
      {
        useTypeScript: false,
        useKoa: true
      },
      {
        useKoa: false,
        useJsx: true
      }
    );
    expect(options).toEqual({
      useTypeScript: false,
      useKoa: false,
      useJsx: true
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('provided options has precedence over default value', () => {
    const [options, args, unknownOptions] = parse(
      [],
      {
        'useTypeScript': {
          alias: 'y',
          desc: 'whether use TypeScript.',
          type: 'boolean',
          default: true
        }
      },
      {
        useTypeScript: false
      }
    );
    expect(options).toEqual({
      useTypeScript: false
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('argv has precedence over provided options', () => {
    const [options, args, unknownOptions] = parse(
      ['-f', './index.jsx'],
      {
        'file': {
          alias: 'f',
          desc: 'the file to be processed.',
          type: 'string'
        }
      },
      {
        'file': './index.js'
      }
    );
    expect(options).toEqual({
      file: './index.jsx'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });
});
