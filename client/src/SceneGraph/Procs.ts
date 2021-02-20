import * as bjs from '@babylonjs/core/Legacy/legacy';

export type LoadAssetHandler = (tasks: bjs.AbstractAssetTask[]) => void;

export type TaskSuccessHandler = (task: bjs.AbstractAssetTask) => void;
export type TaskErrorHandler = (task: bjs.AbstractAssetTask, message: string, exception: any) => void;