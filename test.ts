import { parse } from './src/index';

describe('does parsing', () => {
  it('puts known options into first arguments', () => {

  });

  it('puts arg tokens into second return value', () => {

  });

  it('puts unknown options into the third arguments', () => {

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

  });

  it("boolean with prefixed 'no'", () => {

  });

  it('boolean with rhs true', () => {

  });

  it('boolean with rhs false', () => {

  });

  it("boolean with any value that not equal to 'false'", () => {

  });

  it('number with rhs hexadecimal value', () => {

  });

  it('number with rhs decimal value', () => {

  });

  it('number with rhs octal value', () => {

  });

  it('number with rhs binary value', () => {

  });

  it('number with rhs negative value', () => {

  });

  it('number with following hexadecimal value', () => {

  });

  it('number with following decimal value', () => {

  });

  it('number with following octal value', () => {

  });

  it('number with following binary value', () => {

  });

  it('number with following negative value', () => {

  });

  it('string with rhs value', () => {

  });

  it('string with following value', () => {

  });

  it('number array with multiple following values', () => {

  });

  it('string array with multiple following values', () => {

  });
});

describe('supported flag types', () => {
  it('flag with two dashes', () => {

  });

  it('flag with single dash', () => {

  });

  it('flag with multiple alias in single dash', () => {

  });
});

describe('copies default values for undefined options', () => {
  it('sets true for boolean field', () => {

  });

  it('sets false for boolean field', () => {

  });

  it('sets empty string for string value', () => {

  });

  it('sets nonempty string for string value', () => {

  });

  it('sets 0 for number value', () => {

  });

  it('sets positive number for value', () => {

  });

  it('sets negative number for value', () => {

  });
});

describe('merges provided options', () => {
  it('the latter has precedence over the former', () => {

  });

  it('provided options has precedence over default value', () => {

  });

  it('argv has precedence over provided options', () => {

  });
});
