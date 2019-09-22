import { ASTNodeTypes } from "@textlint/ast-node-types";
import { TEXTLINT_RULES } from "./constants";

export const TextlintASTNodeType = (type: ASTNodeTypes): Function => {
  return (target: any, propertyName: string): void => Reflect.defineMetadata(type, propertyName, target);
};

export const TextlintRule = (): Function => {
  return (target: object): void => Reflect.defineMetadata(TEXTLINT_RULES, true, target);
};
