import Stack from '../stack/index';
import Memory from '../memory/index';
import { arrayify, hexlify, isHexString } from '@ethersproject/bytes';
import { InvalidByteCode, InvalidJump, InvalidProgramCounter, OutOfGas, UnknowOpcode } from './errors';
import Instruction from '../intruction/index';
import Opcodes from '../../opcodes/index';
import { Trie } from '@ethereumjs/trie';

class ExecutionContext {
  private readonly code: Uint8Array
  public stack: Stack;
  public memory: Memory;
  private pc: number;
  private stopped: boolean;
  public output: bigint = BigInt(0);
  public storage: Trie;
  public readonly originalStorage: Trie;
  public gas: bigint;

  constructor(code: string, gas: bigint, storage: Trie) {
    if(!isHexString(code) || code.length % 2 !== 0)
      throw new InvalidByteCode();

    this.code = arrayify(code);
    this.stack = new Stack();
    this.memory = new Memory();
    this.pc = 0;
    this.stopped = false;
    this.storage = storage;
    this.originalStorage = storage.copy()
    this.gas = gas;
  }

  public stop(): void {
    this.stopped = true;
  }

  public async run() {
    while(!this.stopped) {
      const currentPc = this.pc;
      const instruction = this.fetchInstrunction();
      const currentAvailableGas = this.gas;
      const { gasFee } = await instruction.execute(this);

      console.info(`${instruction.name}\t @pc=${currentPc}\t gas=${currentAvailableGas}\t cost=${gasFee}`);

      this.memory.print()
      this.stack.print();

      console.log("")
    }

    console.log("Output\t", hexlify(this.output));
    console.log("Root:\t", hexlify(this.storage.root()));

  }

  public useGas(fee: number) {
    this.gas -= BigInt(fee);

    if(this.gas < 0) throw new OutOfGas()
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

  public jump(destination: bigint): void {
    if(!this.isValidJump(destination)) throw new InvalidJump();
    this.pc = Number(destination);
  }

  private isValidJump(destination: bigint): boolean {
    return this.code[Number(destination) - 1] === Opcodes[0x5b].opcode;
  }
}

export { ExecutionContext };