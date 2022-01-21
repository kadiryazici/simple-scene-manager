import { hookFunctionError, isFunction } from './helpers';

import { currentSceneInstance } from '.';

interface Hook<Runner> {
   (runner: Runner): void;
}

export type BaseHookRunner = () => Promise<void> | void;

export type UpdateHookRunner = (delta: number) => void;
export type PreloadHookRunner = BaseHookRunner;
export type StartHookRunner = BaseHookRunner;
export type RemoveHookRunner = BaseHookRunner;

export const onUpdate: Hook<UpdateHookRunner> = (runner) => {
   if (!isFunction(runner)) return console.error(hookFunctionError('onUpdate'));
   currentSceneInstance?.updateHooks.push(runner);
};

export const onPreload: Hook<PreloadHookRunner> = (runner) => {
   if (!isFunction(runner)) return console.error(hookFunctionError('onPreload'));
   currentSceneInstance?.preloadHooks.push(runner);
};

export const onRemove: Hook<RemoveHookRunner> = (runner) => {
   if (!isFunction(runner)) return console.error(hookFunctionError('onRemove'));
   currentSceneInstance?.removeHooks.push(runner);
};

export const onStart: Hook<StartHookRunner> = (runner) => {
   if (!isFunction(runner)) return console.error(hookFunctionError('onStart'));
   currentSceneInstance?.startHooks.push(runner);
};
