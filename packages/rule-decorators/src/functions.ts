import {
  TextlintRuleContext,
  TextlintRuleModule,
  TextlintRuleOptions,
  TextlintRuleReportHandler,
} from "@textlint/types";
import { TEXTLINT_RULES } from "./constants";

/**
 * Generate reporters
 * @param RuleConstractor
 * @param context
 * @param options
 */
const genReporters = <T extends { new (...args: any[]): {} }>(
  RuleConstractor: T,
  context: Readonly<TextlintRuleContext>,
  options?: TextlintRuleOptions<object>,
): TextlintRuleReportHandler => {
  const reporter: TextlintRuleReportHandler = {};
  const rule = new RuleConstractor(context, options);
  const keys = Reflect.getMetadataKeys(rule) as string[];

  for (const key of keys) {
    const propertyName = Reflect.getMetadata(key, rule);
    const metadata = Reflect.get(rule, propertyName);

    reporter[key] = metadata.bind(rule);
  }

  return reporter;
};

const createReportHandler = <T extends { new (...args: any[]): {} }>(
  RuleConstractors: T[],
): ((context: Readonly<TextlintRuleContext>, options?: TextlintRuleOptions<object>) => TextlintRuleReportHandler) => {
  return (context: Readonly<TextlintRuleContext>, options?: TextlintRuleOptions<object>): TextlintRuleReportHandler => {
    let reporter: TextlintRuleReportHandler = {};

    for (const RuleConstractor of RuleConstractors) {
      if (!Reflect.getMetadata(TEXTLINT_RULES, RuleConstractor)) {
        continue;
      }
      reporter = { ...reporter, ...genReporters<T>(RuleConstractor, context, options) };
    }
    return reporter;
  };
};

export const createReportModule = <T extends { new (...args: any[]): {} }>(rules: T[]): TextlintRuleModule => {
  const reporter = createReportHandler<T>(rules);
  return { fixer: reporter, linter: reporter };
};
