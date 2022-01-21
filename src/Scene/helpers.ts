import { BaseHookRunner } from './hooks';

export const hookRunnersToPromises = (runners: BaseHookRunner[]): Promise<void>[] => {
   return runners.map((func) => Promise.resolve(func()));
};

export const runBaseHooks = (runners: BaseHookRunner[]) => {
   if (!Array.isArray(runners)) {
      throw new Error(`Expected runners to be Array but got ${typeof runners}`);
   }

   for (const runner of runners) {
      if (isFunction(runner)) runner();
   }
};

export const isFunction = (param: any): param is Function => typeof param === 'function';

export const hookFunctionError = (hookName: string) =>
   new Error(`${hookName} hook received a non function parameter. Please give function instead.`);
