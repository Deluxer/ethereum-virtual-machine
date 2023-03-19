import { hexlify } from "@ethersproject/bytes";
import { MAX_UNIT256 } from "../../constants";
import { InvalidMemoryOffset, InvalidMemoryValue, OffsetValueError } from "./erros";

class Memory {
  private memory: bigint[];

  constructor() {
    this.memory = [];
  }

  public store(offset: bigint, value: bigint): void {
    if(offset < 0 || offset > MAX_UNIT256)
      throw new InvalidMemoryOffset(offset, value);

    if(value < 0 || value > MAX_UNIT256)
      throw new InvalidMemoryValue(offset, value);

    this.memory[Number(offset)] = value;
  }

  public print(): void {
    console.log(
      `Memory:\t`,
      this.memory.map((value) => hexlify(value))
    );
  }

  public load(offset:bigint): bigint {
    if(offset < 0 || offset > MAX_UNIT256)
      throw new InvalidMemoryOffset(offset, BigInt(0))

    if(offset >= this.memory.length) return BigInt(0);

    return this.memory[Number(offset)];
  }
}

export default Memory;