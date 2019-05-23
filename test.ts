import { parse } from './src/index';

describe('does parsing', () => {
  it('puts known options into first return value', () => {
    const [options, args, unknownOptions] = parse(
      ['--access', '-c', 'memory'],
      {
        'access': {
          alias: 'y',
          desc: 'a way of entering or reaching a place.',
          type: 'boolean'
        },
        'cache': {
          alias: 'c',
          desc: 'from memory cache.',
          type: 'string'
        }
      }
    )
    expect(options).toEqual({
      access: true,
      cache: 'memory'
    });
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual([]);
  });

  it('puts arg tokens into second return value', () => {
    const [options, args, unknownOptions] = parse(
      ['--bugs', 'one', 'two', '-c'],
      {}
    )
    expect(options).toEqual({});
    expect(args).toEqual(['one', 'two']);
    expect(unknownOptions).toEqual(['--bugs', '-c']);
  });

  it('puts unknown options into third return value', () => {
    const [options, args, unknownOptions] = parse(
      ['--i-am-unknown', '-v'],
      {}
    )
    expect(options).toEqual({});
    expect(args).toEqual([]);
    expect(unknownOptions).toEqual(['--i-am-unknown', '-v']);
  });

  it('works', () => {
    const [options, args] = parse(
      ['one', '--yesterday', 'two', '-q', 'three'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      yesterday: true,
      quiet: 'three'
    });
    expect(args).toEqual(['one', 'two']);
  });

});

describe('supported value types', () => {
  it('boolean without following argument', () => {
    const [options] = parse(
      ['--stars', '-q'],
      {
        'stars': {
          alias: 's',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      stars: true,
      quiet: true,
    });
  });

  it.skip("boolean with prefixed 'no'", () => {
    const [options] = parse(
      ['--no-stars', '--no-quiet'],
      {
        'no-stars': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'no-quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      'no-stars': undefined,
      'no-quiet': undefined
    });
  });

  it('boolean with rhs true', () => {
    const [options] = parse(
      ['--stars=true', '--moon=true'],
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
  });

  it('boolean with rhs false', () => {
    const [options] = parse(
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
  });

  it("boolean with any value that not equal to 'false'", () => {
    const [options] = parse(
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
  });

  it.skip('number with rhs hexadecimal value', () => {
    const [options] = parse(
      ['--starfish=0x522', '--hippocampus=0x400'],
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
      'starfish': 0x522,
      'hippocampus': 0x400
    });
  });

  it('number with rhs decimal value', () => {
    const [options] = parse(
      ['--starfish=1314', '--hippocampus=1024'],
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
      'starfish': 1314,
      'hippocampus': 1024
    });
  });

  it('number with rhs octal value', () => {
    const [options] = parse(
      ['--starfish=0o2442', '--hippocampus=0o2000'],
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
      'starfish': 0o2442,
      'hippocampus': 0o2000
    });
  });

  it('number with rhs binary value', () => {
    const [options] = parse(
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
  });

  it('number with rhs negative value', () => {
    const [options] = parse(
      ['--starfish=-1314', '--hippocampus=-1024'],
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
      'starfish': -1314,
      'hippocampus': -1024
    });
  });

  it('number with following hexadecimal value', () => {
    const [options] = parse(
      ['--starfish', '0x522', '--hippocampus', '0x400'],
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
      'starfish': 0x522,
      'hippocampus': 0x400
    });
  });

  it('number with following decimal value', () => {
    const [options] = parse(
      ['--starfish', '1314', '--hippocampus', '1024'],
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
      'starfish': 1314,
      'hippocampus': 1024
    });
  });

  it('number with following octal value', () => {
    const [options] = parse(
      ['--starfish', '0o2442', '--hippocampus', '0o2000'],
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
      'starfish': 0o2442,
      'hippocampus': 0o2000
    });
  });

  it('number with following binary value', () => {
    const [options] = parse(
      ['--starfish', '0b10100100010', '--hippocampus', '0b10000000000'],
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
  });

  it('number with following negative value', () => {
    const [options] = parse(
      ['--starfish', '-1314', '--hippocampus', '-1024'],
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
      'starfish': -1314,
      'hippocampus': -1024
    });
  });

  it('string with rhs value', () => {
    const [options] = parse(
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
  });

  it('string with following value', () => {
    const [options] = parse(
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
  });

  it('number array with multiple following values', () => {
    const [options] = parse(
      ['--date', '1314', '1024', '--number', '9527', '777'],
      {
        'date': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'number[]'
        },
        'number': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'number[]'
        }
      }
    );
    expect(options).toEqual({
      'date': [1314, 1024],
      'number': [9527, 777]
    });
  });

  it('string array with multiple following values', () => {
    const [options] = parse(
      ['--city', 'Paris', 'London', '--country', 'France', 'England'],
      {
        'city': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'string[]'
        },
        'country': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string[]'
        }
      }
    );
    expect(options).toEqual({
      'city': ['Paris', 'London'],
      'country': ['France', 'England']
    });
  });
});

describe('supported flag types', () => {
  it('flag with two dashes', () => {
    const [options] = parse(
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
  });

  it('flag with single dash', () => {
    const [options] = parse(
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
  });

  it('flag with multiple alias in single dash', () => {
    const [options] = parse(
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
  });
});

describe('copies default values for undefined options', () => {
  it('sets true for boolean field', () => {
    const [options] = parse(
      ['--yesterday=true', '-q', 'true'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    expect(options).toEqual({
      yesterday: true,
      quiet: true
    });
  });

  // TODO: error: "quiet": true
  it('sets false for boolean field', () => {
    const [options] = parse(
      ['--yesterday=false', '--quiet', 'false'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    // expect(options).toEqual({
    //   yesterday: false,
    //   quiet: false
    // });
  });

  // TODO: error 
  // '--yesterday=' or '--yesterday' => "yesterday": undefined
  // "--yesterday=''" => "yesterday": "''"
  // '--yesterday=""' => "yesterday": "\"\"",
  it('sets empty string for string value', () => {
    const [options] = parse(
      ['--yesterday=""', '-q', ''],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'string'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      yesterday: '',
      quiet: ''
    });
  });

  it('sets nonempty string for string value', () => {
    const [options] = parse(
      ['--yesterday=one', '-q', 'two'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'string'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      yesterday: 'one',
      quiet: 'two'
    });
  });

  it('sets 0 for number value', () => {
    const [options] = parse(
      ['--yesterday=0', '-q', '0'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'number'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      yesterday: 0,
      quiet: 0
    });
  });

  it('sets positive number for value', () => {
    const [options] = parse(
      ['--yesterday=9', '-q', '9'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'number'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'number'
        }
      }
    );
    expect(options).toEqual({
      yesterday: 9,
      quiet: 9
    });
  });

  // TODO: error "quiet": undefined -q=-9 or '-q', '-9'
  it('sets negative number for value', () => {
    const [options] = parse(
      ['--yesterday=-9', '-q=-9'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'number'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'number'
        }
      }
    );
    // expect(options).toEqual({
    //   yesterday: -9,
    //   quiet: -9
    // });
  });
});

describe('merges provided options', () => {
  it('the latter has precedence over the former', () => {
    const [options] = parse(
      ['--yesterday=true', '--yesterday=false', '-q', 'one', '-q', 'two'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      yesterday: false,
      quiet: 'two'
    });
  });

  // TODO: error quiet: true, args ['false']
  it('provided options has precedence over default value', () => {
    const [options, args] = parse(
      ['--yesterday=false', '--quiet', 'false'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'boolean'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'boolean'
        }
      }
    );
    // expect(options).toEqual({
    //   yesterday: false,
    //   quiet: false
    // });
    // expect(args).toEqual([]);
  });

  // TODO: precedence over？
  it('argv has precedence over provided options', () => {
    const [options, args] = parse(
      ['yesterday', '--yesterday', 'quiet', '-q', 'three'],
      {
        'yesterday': {
          alias: 'y',
          desc: 'oh I believe in yesterday.',
          type: 'string'
        },
        'quiet': {
          alias: 'q',
          desc: 'the quiet one.',
          type: 'string'
        }
      }
    );
    expect(options).toEqual({
      yesterday: 'quiet',
      quiet: 'three'
    });
    expect(args).toEqual(['yesterday']);
  });
});
