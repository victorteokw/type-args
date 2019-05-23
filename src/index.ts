import * as camelCase from 'camelcase';

interface BooleanOptionRule {
  alias?: string,
  desc: string,
  type: 'boolean',
  default?: boolean
}

interface StringOptionRule {
  alias?: string,
  desc: string,
  type: 'string',
  default?: string
}

interface NumberOptionRule {
  alias?: string,
  desc: string,
  type: 'number',
  default?: number
}

interface StringArrayOptionRule {
  alias?: string,
  desc: string,
  type: 'string[]',
  default?: string[]
}

interface NumberArrayOptionRule {
  alias?: string,
  desc: string,
  type: 'number[]',
  default?: number[]
}

type SOptionRule = BooleanOptionRule | StringOptionRule | NumberOptionRule;
type MOptionRule = StringArrayOptionRule | NumberArrayOptionRule;
type OptionRule = SOptionRule | MOptionRule;

interface OptionRules {
  [key: string]: OptionRule
}

interface Options {
  [key: string]: boolean | number | string | number[] | string[]
}

function isUndefined(value: any) {
  return value === undefined;
}

function firstDefined<T> (...args: T[]): T | undefined {
  for (const arg of args) {
    if (arg !== undefined) {
      return arg;
    }
  }
  return undefined;
};

function desiredValue(value: string, rule: OptionRule) {
  switch (rule.type) {
    case 'boolean':
      return value !== 'false';
    case 'string':
    case 'string[]':
      return value;
    case 'number':
    case 'number[]':
      return Number(value);
  }
}

function charIsAlphabet(char: string) {
  return ((char >= 'A') && (char <= 'Z')) || ((char >= 'a') && (char <= 'z'));
}

export function parse(
  argv: string[], rules: OptionRules, ...bases: Options[]
): [Options, string[], string[]] {
  const options = {};
  const args: string[] = [];
  const unknownOptions: string[] = [];
  const aliases: object = {};
  const aliasesNameMap: object = {};
  let generatedAliasesMap: boolean = false;
  const { length } = argv;
  let currentOption: string | undefined;
  let currentRule: OptionRule | undefined;
  let singleAssign: boolean | undefined;
  for (let i = 0; i < length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const [lhs, rhs] = arg.split('=');
      const option = camelCase(lhs.substr(2));
      if (rules[option]) {
        currentOption = option;
        currentRule = rules[option];
        singleAssign = !currentRule.type.endsWith('[]');
        if (!singleAssign && !options[option]) options[option] = [];
        if (rhs) {
          if (singleAssign) {
            options[option] = desiredValue(rhs, currentRule);
            currentOption = undefined;
            currentRule = undefined;
            singleAssign = undefined;
          } else {
            options[option].push(desiredValue(rhs, currentRule));
          }
        } else {
          if (currentRule.type === 'boolean') {
            options[option] = true;
            currentOption = undefined;
            currentRule = undefined;
            singleAssign = undefined;
          }
        }
      } else {
        unknownOptions.push(lhs);
      }
    } else if ((arg[0] === '-') && charIsAlphabet(arg[1])) {
      if (!generatedAliasesMap) {
        for (const ruleName in rules) {
          const rule = rules[ruleName];
          if (rule.alias) {
            aliases[rule.alias] = rule;
            aliasesNameMap[rule.alias] = ruleName;
          }
        }
        generatedAliasesMap = true;
      }
      const { length } = arg;
      for (let i = 1; i < length; i++) {
        const alias = arg[i];
        if (aliases[alias]) {
          currentRule = aliases[alias] as OptionRule;
          currentOption = aliasesNameMap[alias] as string;
          singleAssign = !currentRule.type.endsWith('[]');
          if (currentRule.type === 'boolean') {
            options[currentOption] = true;
            currentOption = undefined;
            currentRule = undefined;
            singleAssign = undefined;
          }
        } else {
          unknownOptions.push(`-${alias}`);
        }
      }
    } else {
      if (currentRule && currentOption) {
        if (singleAssign) {
          options[currentOption] = desiredValue(arg, currentRule);
          currentOption = undefined;
          currentRule = undefined;
          singleAssign = undefined;
        } else {
          options[currentOption].push(desiredValue(arg, currentRule));
        }
      } else {
        args.push(arg);
      }
    }
  }
  let base = {};
  if (bases.length) {
    base = Object.assign({}, ...bases);
  }
  const keysOfRules = Object.keys(rules);
  const lengthOfRules = keysOfRules.length;
  for (let i = 0; i < lengthOfRules; i++) {
    const ruleName = keysOfRules[i];
    if (isUndefined(options[ruleName])) {
      options[ruleName] = firstDefined(base[ruleName], rules[ruleName].default);
    }
  }
  return [options, args, unknownOptions];
};
