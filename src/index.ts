import { words } from './constants';
import json from './test.json';

export const say = (name: string): void => {
  console.log(`${name} say: ${words}`);
  console.log(json.name);
};
