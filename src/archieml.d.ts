declare module 'archieml' {
  export function load<T>(content: string): T;
  export type ArchieMLValue = string | string[] | { [key: string]: ArchieMLValue };
  export type ArchieMLObj = Record<string, ArchieMLValue>;
}
