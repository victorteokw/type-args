import { parse } from './src/index';

describe('parses value', () => {
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
