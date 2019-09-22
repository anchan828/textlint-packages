import { ASTNodeTypes, TypeofTxtNode } from "@textlint/ast-node-types";
import { TextlintRuleContext } from "@textlint/types";
import "reflect-metadata";
import TextLintTester from "textlint-tester";
import { TextlintASTNodeType, TextlintRule } from "./decorators";
import { createReportModule } from "./functions";
describe("createReportModule", (): void => {
  it("should be defined", () => {
    expect(createReportModule).toBeDefined();
  });

  it("should create module", (): void => {
    expect(createReportModule([])).toStrictEqual({
      fixer: expect.any(Function),
      linter: expect.any(Function),
    });
  });

  describe("Run module", () => {
    const tester: TextLintTester = new TextLintTester();

    tester.run("should compile no rule class", createReportModule<any>([class Test {}]), {
      valid: [{ text: "test" }],
    });

    @TextlintRule()
    class Test1 {}

    tester.run("should compile rule class", createReportModule<any>([Test1]), {
      valid: [{ text: "test" }],
    });

    @TextlintRule()
    class Test2 {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      test(): void {}
    }

    tester.run("should compile rule class, but no repoter", createReportModule<any>([Test2]), {
      valid: [{ text: "test" }],
    });

    @TextlintRule()
    class Test3 {
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

    tester.run("should compile rule class, but no repoter", createReportModule<any>([Test3]), {
      invalid: [{ errors: [{ message: "error" }], output: "valid", text: "error" }],
      valid: [{ text: "test" }],
    });
  });
});
