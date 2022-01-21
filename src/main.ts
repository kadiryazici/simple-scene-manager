import { createGame, defineScene } from './Scene';
import { onPreload, onRemove, onStart, onUpdate } from './Scene/hooks';

const MainScene = defineScene('Main', () => {
   const loadedAssets: string[] = [];

   onPreload(() => {
      loadedAssets.push('Character Loaded');
   });

   onPreload(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      loadedAssets.push('Promise Resolved');
   });

   onStart(() => {
      console.log({ loadedAssets });
   });

   onUpdate((deltaTime) => {
      console.log(deltaTime);
   });

   onRemove(() => {
      console.log('Main Scene Removed');
   });
});

const OtherScene = defineScene('Other', () => {
   const world = 'Hello';

   onStart(() => {
      console.log(world);
   });
});

const game = createGame({
   scenes: [MainScene, OtherScene],
   target: '#app',
});

game.load('Main');
