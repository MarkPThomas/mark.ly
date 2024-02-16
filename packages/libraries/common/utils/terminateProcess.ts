export default (exitCode: number, delay?: number): void => {
  setTimeout(() => process.exit(exitCode), delay);
};