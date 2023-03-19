class InvalisStackValue extends Error {
  constructor(value: bigint) {
    super(`Value ${value} is invalid`);
  }
}

class StackOverflow extends Error {}

class StackUnderflow extends Error {}

class IndexOutOfBouns extends Error {}

export {InvalisStackValue, StackOverflow, StackUnderflow, IndexOutOfBouns };