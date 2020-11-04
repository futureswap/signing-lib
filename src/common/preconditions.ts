export function checkDefined<T>(
  val: T | null | undefined,
  message = 'Should not be befined'
): T {
  if (val === null || val === undefined) {
    throw new Error(message);
  }
  return val;
}

export function checkArgument(expression: boolean, message = 'checkArgument') {
  if (!expression) {
    throw new Error(message);
  }
}
