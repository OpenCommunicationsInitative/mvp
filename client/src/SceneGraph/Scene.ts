import * as bjs from '@babylonjs/core/Legacy/legacy';
import { SceneElement } from './SceneElement';
import { IScene, ISceneElement, ISceneDataSource, ISceneDataSink } from './SceneGraphInterfaces';
import Logger from '../Utils/Logger';


import { AssetManager } from './AssetManager';
import {LoadAssetHandler} from './Procs';
import { SceneFormatType } from './Enums';
import { EventBus } from './EventBus';

export class Scene implements IScene
{
    engine : bjs.Engine | undefined;
    bjsScene!: bjs.Scene;
    camera!: bjs.ArcRotateCamera;
    hdrTexture: bjs.CubeTexture | undefined;
    hdrSkybox: bjs.Mesh | undefined;
    sceneType: SceneFormatType = SceneFormatType.Portrait;
    sceneElements: Array<ISceneElement> = new Array<SceneElement>();

    isAssetLoaded: boolean = false;
    
    assetsPath: Array<Object> = [];

    constructor(public title: string, public canvas: HTMLElement) {
    }

    public aspectRatio() : number
    {
        if (this.camera) {
            return this.camera.viewport.height / this.camera.viewport.width;
        }

        return 1;
    }


    public load(engine : bjs.Engine)
    {
        this.initScene(engine);
        this.setupCamera();

        /*
        this.loadAssets();

        EventBus.Instance.eventHandler.subscribe((p, r) => {
            if (r === 'SCENE_ASSET_LOADED') {
                this.createBaseScene();
            }
        });
        */

        this.createBaseScene();
        
        window.addEventListener("beforeunload", () => {
            Logger.log("Scene : Detecting browser close. Destroying engine.");
        });
    }

    public initScene(engine : bjs.Engine)
    {   
        this.engine = engine;
        this.bjsScene = new bjs.Scene(engine);
        this.sceneElements = new Array<SceneElement>();
    }

    public unload()
    {
        this.onUnload();
        this.unloadAssets();
    }

    protected onUnload()
    {
        if (this.bjsScene)
        {
            this.bjsScene.cleanCachedTextureBuffer();
            this.bjsScene.clearCachedVertexData();    
        }

        if (this.bjsScene) {
            // this.bjsScene.dispose();
        }
    }

    public loadAssets()
    {
        AssetManager.Instance.init(this);
        AssetManager.Instance.load(this.assetsPath, () => {
            EventBus.Instance.emit("SCENE_ASSET_LOADED");
        });
    }

    public unloadAssets()
    {
        AssetManager.Instance.unload(this.assetsPath);
    }

    protected setupCamera()
    {
        Logger.log("Scene : setupCamera()");
    }

    public async createBaseScene ()
    {
        Logger.log("Creating Base Scene");
        if (this.bjsScene) {
        }

    

        this.createScene();

        if (this.bjsScene)
        {
            this.bjsScene.registerBeforeRender(() => {
                this.preRender();  
            });
    
            this.bjsScene.registerAfterRender(() => {
                this.postRender();  
            });    
        }

        
    }
    
    protected async createScene()
    {
    }

    public AddSceneElement(element: ISceneElement)
    {
        this.sceneElements.push(element);
    }

    public DeleteSceneElement(name: string) {
        this.sceneElements = this.sceneElements.filter((se: ISceneElement) => se['name'] !== name);
    }

    public format(type: SceneFormatType)
    {
        this.sceneType = type;
        this.sceneElements.forEach( e => { e.format() });
        this.onFormat();
    }
    
    public preRender()
    {
        if (this.camera != null)
        {
            this.sceneElements.forEach( e => { e.preRender() })
            this.onPreRender();
        }
    }

    public render() {

        if (this.camera != null)
        {
            this.sceneElements.forEach( e => { e.render() });
            this.onRender();
    
            if (this.bjsScene) {
                this.bjsScene.render();
            }    
        }
    }

    public postRender()
    {
        if (this.camera != null)
        {
            this.sceneElements.forEach( e => { e.postRender() })
            this.onPostRender();
        }
    }


    /*
    public aspectRatio() : number
    {
        if (this.camera) {
            return this.camera.viewport.height / this.camera.viewport.width;
        }

        return 1;
    }
    */

    protected onPreRender()
    {
    }
    
    protected onRender()
    {
    }

    protected onPostRender()
    {
    }

    protected onFormat()
    {

    }
}
