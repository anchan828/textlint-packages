import { ASTNodeTypes } from "@textlint/ast-node-types";
import { TEXTLINT_RULES } from "./constants";

export const TextlintASTNodeType = (type: ASTNodeTypes): MethodDecorator => {
  return (target: object, propertyName: string | symbol): void => Reflect.defineMetadata(type, propertyName, target);
};

export const TextlintRule = (): ClassDecorator => {
  return (target: object): void => Reflect.defineMetadata(TEXTLINT_RULES, true, target);
};
