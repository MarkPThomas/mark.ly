export class Logger {
  static log(message, ...optParams) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, ...optParams);
    }
  }
}