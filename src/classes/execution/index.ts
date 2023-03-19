import Stack from '../stack/index';
import Memory from '../memory/index';
import { arrayify, hexlify, isHexString } from '@ethersproject/bytes';
import { InvalidByteCode, InvalidProgramCounter, UnknowOpcode } from './errors';
import Instruction from '../intruction/index';
import Opcodes from '../../opcodes/index';

class ExecutionContext {
  private readonly code: Uint8Array
  public stack: Stack;
  public memory: Memory;
  private pc: number;
  private stopped: boolean;
  public output: bigint = BigInt(0);

  constructor(code: string) {
    if(!isHexString(code) || code.length % 2 !== 0)
      throw new InvalidByteCode();

    this.code = arrayify(code);
    this.stack = new Stack();
    this.memory = new Memory();
    this.pc = 0;
    this.stopped = false;
  }

  public stop(): void {
    this.stopped = true;
  }

  public run() {
    while(!this.stopped) {
      const currentPc = this.pc;
      const instruction = this.fetchInstrunction();
      instruction.execute(this)

      console.info(`${instruction.name}\t @pc=${currentPc}`);

      this.memory.print()
      this.stack.print();

      console.log("")
    }

    console.log("Output\t", hexlify(this.output))
  }

  private fetchInstrunction(): Instruction {
    if(this.pc >= this.code.length) return Opcodes[0];

    if(this.pc < 0) throw new InvalidProgramCounter();

    const opcode = this.readByteFromCode(1);

    const instruction = Opcodes[Number(opcode)];

    if(!instruction) throw new UnknowOpcode();

    return instruction;
  }

  public readByteFromCode(bytes = 1): bigint {
    const hexValues = this.code.slice(this.pc, this.pc + bytes);
    console.log('hexValues: ', hexValues[0])

    const values = BigInt(hexlify(hexValues));

    this.pc += bytes;

    return values;
  }
}

export { ExecutionContext };