# @anchan828/textlint-rule-decorators

## Install

```shell
npm i @anchan828/textlint-rule-decorators reflect-metadata
```

## Usage

```typescript
import { createReportModule, TextlintRule, TextlintASTNodeType } from "@anchan828/textlint-rule-decorators";

@TextlintRule()
class MyRule {
  constructor(private context: Readonly<TextlintRuleContext>) {}

  @TextlintASTNodeType(ASTNodeTypes.Str)
  async strReporter(node: TypeofTxtNode<ASTNodeTypes.Str>): Promise<void> {
    if (node.value === "error") {
      const ruleError = new this.context.RuleError(`error`, {
        fix: this.context.fixer.replaceText(node, "valid"),
      });

      this.context.report(node, ruleError);
    }
  }
}

export = createReportModule([MyRule]);
```
