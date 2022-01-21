import { PreloadHookRunner, RemoveHookRunner, StartHookRunner, UpdateHookRunner } from './hooks';
import { hookRunnersToPromises, runBaseHooks } from './helpers';

export interface SceneInstance {
   updateHooks: UpdateHookRunner[];
   preloadHooks: PreloadHookRunner[];
   removeHooks: RemoveHookRunner[];
   startHooks: StartHookRunner[];
   name: string;
}

export interface Scene {
   name: string;
   create(): Promise<SceneInstance>;
}

export interface DefineScene {
   (name: string, setup: () => Promise<void> | void): Scene;
}

export let currentSceneInstance: SceneInstance | undefined = undefined;

const createSceneInstance = (name: string): SceneInstance => ({
   updateHooks: [],
   preloadHooks: [],
   removeHooks: [],
   startHooks: [],
   name
});

export const defineScene: DefineScene = (name, setup) => ({
   name,
   async create() {
      const instance = createSceneInstance(name);
      currentSceneInstance = instance;
      await Promise.resolve(setup());
      currentSceneInstance = undefined;
      return instance;
   }
});

interface CreateGameOptions {
   scenes: Scene[];
   target: string | HTMLElement;
   fps?: number;
}

export function createGame({ scenes, fps }: CreateGameOptions) {
   let activeScene: SceneInstance | undefined = undefined;
   let currentInterval = -1;
   let currentAnimationFrame = -1;
   let deltaTime = 0;
   let oldTime = 0;
   let useAnimationFrame = !fps;
   let isGameStopped = false;

   const update = () => {
      if (useAnimationFrame) {
         currentAnimationFrame = requestAnimationFrame(update);
      }

      const newTime = performance.now();
      deltaTime = (newTime - oldTime) / 1000;
      oldTime = newTime;

      if (isGameStopped || !activeScene) return;

      for (const runner of activeScene.updateHooks) {
         runner(deltaTime);
      }
   };

   const startLoop = () => {
      if (useAnimationFrame) {
         cancelAnimationFrame(currentAnimationFrame);
         currentAnimationFrame = requestAnimationFrame(update);
         return;
      }

      clearInterval(currentInterval);
      currentInterval = setInterval(update, 1000 / (fps || 60));
   };

   const load = async (name: string) => {
      if (activeScene) {
         Promise.all(hookRunnersToPromises(activeScene.removeHooks));
         activeScene = undefined;
      }

      const foundScene = scenes.find((scene) => scene.name === name);
      if (foundScene) {
         activeScene = await Promise.resolve(foundScene.create());
         await Promise.all(hookRunnersToPromises(activeScene.preloadHooks));
         runBaseHooks(activeScene.startHooks);
         startLoop();
      }
   };

   const stop = () => {
      isGameStopped = true;
   };

   const resume = () => {
      isGameStopped = false;
   };

   return {
      load,
      stop,
      resume
   };
}
