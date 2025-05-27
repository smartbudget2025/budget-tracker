import '@testing-library/jest-native/extend-expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string) => R;
      toBeVisible: () => R;
      toBeDisabled: () => R;
      toContainElement: (element: any) => R;
      toHaveStyle: (style: any) => R;
    }
  }

  const jest: {
    fn: () => any;
    mock: (moduleName: string, factory?: () => any) => void;
    spyOn: (object: any, method: string) => any;
    setTimeout: (timeout: number) => void;
  };

  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function expect(value: any): any;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
} 