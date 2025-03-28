// Type definitions for React 19+

declare namespace React {
  // Basic types
  export type ReactNode = 
    | ReactElement 
    | string 
    | number 
    | boolean 
    | null 
    | undefined 
    | ReadonlyArray<ReactNode>;

  export interface ReactElement {
    type: any;
    props: any;
    key: string | number | null;
  }

  // Context API
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }

  export interface Provider<T> {
    (props: { value: T; children: ReactNode }): ReactElement | null;
  }

  export interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): ReactElement | null;
  }

  // Component types
  export interface Component<P = {}, S = {}> {
    render(): ReactNode;
    props: Readonly<P>;
    state: Readonly<S>;
    setState(state: S | ((prevState: S) => S), callback?: () => void): void;
  }
}

declare module 'react' {
  // Export the React namespace
  export = React;
  export as namespace React;
  
  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  
  // Context API
  export function createContext<T>(defaultValue: T): React.Context<T>;
  
  // Component creation
  export function createElement(
    type: string | any,
    props?: any,
    ...children: React.ReactNode[]
  ): React.ReactElement;
} 