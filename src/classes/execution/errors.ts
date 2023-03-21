class InvalidByteCode extends Error {}

class InvalidProgramCounter extends Error {}

class UnknowOpcode extends Error {};

class InvalidJump extends Error {}

class OutOfGas extends Error {}

export {InvalidByteCode, InvalidProgramCounter, UnknowOpcode, InvalidJump, OutOfGas};