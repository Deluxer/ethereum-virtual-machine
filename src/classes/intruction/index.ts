import { ExecutionContext } from "../execution";
import { ImplementedError } from "./errors";

const defaultExecution = () => {
  throw new ImplementedError();
}

class Instruction {
  public readonly opcode: number;
  public readonly name: string;
  public readonly execute: (ctx: ExecutionContext) => Promise<void> | void;

  constructor(
    opcode: number,
    name: string,
    execute: (ctx: ExecutionContext) => void = defaultExecution
  )
  {
    this.opcode = opcode;
    this.name = name;
    this.execute = execute;
  }
}

export default Instruction;