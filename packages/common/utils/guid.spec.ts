import randomGuid from './guid';

describe('#guid', () => {
  it('should return a changing GUID', () => {
    expect(randomGuid()).not.toEqual(randomGuid());
  });

  it('should return a valid random GUID', () => {
    // See: https://www.geeksforgeeks.org/how-to-validate-guid-globally-unique-identifier-using-regular-expression/

    const guid = randomGuid();
    // e.g. 'a8754a66-e3f4-4536-a961-d216770ca985'

    const regex = new RegExp(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/);

    expect(regex.test(guid)).toBeTruthy();
  });
});