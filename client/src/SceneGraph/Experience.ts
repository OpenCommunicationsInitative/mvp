import { IScene, IExperience } from './SceneGraphInterfaces';
import { Scene } from './Scene';
import * as bjs from '@babylonjs/core/Legacy/legacy';
import { SceneManager } from './SceneManager';
import { AssetManager } from './AssetManager';
import { ViewportPosition } from "./Enums";
import { EventBus } from './EventBus';

export class Experience implements IExperience
{
    scenes: Array<IScene> = new Array<Scene>();
    public isAssetLoaded: boolean = false;

    public assetsPath = [
        {type: 'mesh', name:'Font_Conthrax_New', url: '/', fileName: 'Font_Conthrax_New.babylon'}
    ];

    constructor(public title: string, public canvas: HTMLCanvasElement) {
    } 

    public load()
    {
        // this.onLoad();
       

        EventBus.Instance.eventHandler.subscribe((p, r) => {
            if (r === 'EXPERIENCE_ASSET_LOADED') {
                this.isAssetLoaded = true;
                this.onLoad();
            }
        });

        this.loadAssets();
    }

    public unload()
    {
        this.onUnload();
        this.unloadAssets();
    }

    protected onLoad()
    {

    }

    protected onUnload()
    {
     
    }

    public loadAssets()
    {
        let emptyScene: Scene = new Scene('emptyScene', this.canvas);
        SceneManager.Instance.LoadScene(emptyScene, this.canvas, ViewportPosition.Top);
        AssetManager.Instance.init(emptyScene);
       
       // AssetManager.Instance.load(this.assetsPath, () => {
            EventBus.Instance.emit("EXPERIENCE_ASSET_LOADED");
      //  });
    }

    public unloadAssets()
    {
        AssetManager.Instance.unload(this.assetsPath);
    }

    public AddScene(scene: IScene)
    {
        this.scenes.push(scene);
    }

    public RemoveScene(name: string) {
        this.scenes = this.scenes.filter((se: IScene) => se['name'] !== name);
    }
}
