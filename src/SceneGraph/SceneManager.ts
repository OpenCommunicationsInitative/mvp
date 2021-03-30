import * as bjs from '@babylonjs/core/Legacy/legacy';
import { Scene } from './Scene';
import Logger from '../Utils/Logger';
import { ViewportPosition } from "./Enums";

export class SceneManager<C extends bjs.Camera> 
{
    private static _instance: SceneManager<bjs.Camera>;
    public scenes : Array<Scene> = new Array<Scene>();
    engine!: bjs.Engine;
    canvas!: HTMLCanvasElement;
    
    private constructor()
    {
    }

    public LoadScene(scene: Scene, canvas : HTMLCanvasElement, position : ViewportPosition)
    {
        Logger.log("SceneManager : Loading Scene")
        if ( this.scenes.length === 0)
        {
            this.engine = new bjs.Engine(canvas as HTMLCanvasElement,true,undefined,true);
            // this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
        }

        Logger.log("SceneManager : Adding Scene : ");
        this.scenes.push(scene);
        this.canvas = canvas;

        if (this.engine) {
            if (scene.title == "emptyScene") {
                scene.initScene(this.engine);
                return;
            }

            scene.load(this.engine);
        }

        if (scene.bjsScene && this.scenes.length > 1)
        {
            scene.bjsScene.autoClear = false;
        }

        /*
        if (scene.camera && position === ViewportPosition.Bottom)
        {
            scene.camera.viewport = new bjs.Viewport(0, 0, 1.0, 0.5);
        }
        else if (scene.camera && position === ViewportPosition.Top)
        {
            scene.camera.viewport = new bjs.Viewport(0, 0.5, 1.0, 0.5);
        }
        */
        

        if (this.engine) {
            this.engine.runRenderLoop(() => {
                this.scenes.forEach( e => { e.render() });
            });
        }

        window.addEventListener("resize", () => {
            if (this.engine) {
                this.engine.resize();
            }
        });
    }

    public clear() {
        this.scenes.forEach((scene: Scene) => {
            scene.unload();
        });

        this.scenes = new Array<Scene>();
        //this.engine = undefined;

        if (this.canvas) {
            const context = this.canvas.getContext("webgl");

            if (context) {
                // context.clearColor(255, 255, 255, 1);
                context.clear(context.COLOR_BUFFER_BIT);
            }
        }
    }

    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}
