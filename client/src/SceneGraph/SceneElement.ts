import * as bjs from '@babylonjs/core/Legacy/legacy';
import { Scene } from './Scene';
import { ISceneElement } from './SceneGraphInterfaces';

export abstract class SceneElement extends bjs.TransformNode implements ISceneElement
{
    public scene: Scene;
    sceneElements: Array<ISceneElement>;
    isCreated : boolean = false;

    constructor(public name: string, public x: number, public y: number, public z: number, scene: Scene)
    {
        super(name,scene.bjsScene);
        this.scene = scene;
        this.position = new bjs.Vector3(x, y, z);
        this.sceneElements = new Array<SceneElement>();
        this.onAddCustomProperties();
    }

    public create()
    {
        this.onCreate();
        this.isCreated = true;
        this.onFormat();
    }

   
    public preRender()
    {
        if (this.isCreated)
        {
            this.sceneElements.forEach( e => { e.preRender() });
            this.onPreRender();
        }
    }

    public render()
    {
        if (this.isCreated)
        {
            this.sceneElements.forEach( e => { e.render() });
            this.onRender();
        }
    }

    public postRender()
    {
        if (this.isCreated)
        {
            this.sceneElements.forEach( e => { e.postRender() });
            this.onPostRender();
        }
    }

    public addChild(element: SceneElement)
    {
        element.parent = this;
        this.sceneElements.push(element);
    }

    public format()
    {
        this.sceneElements.forEach( e => { e.format() });
        this.onFormat();
    }

    public removeChild(element: SceneElement) {
        element.parent = null;
        this.sceneElements = this.sceneElements.filter(ele => ele.name !== element.name);
    }

    public removeAll()
    {
        this.sceneElements.forEach((ele, index) => {
            let elem = ele as SceneElement;
            elem.parent = null;
            elem.destroy();
        });

        this.sceneElements = [];
    }

    public destroy()
    {
        // let childs = this.getChildTransformNodes();
        /*
        if (this.constructor.name === 'TextMeshString')
        {
            // this.setEnabled(false);
            this.onDisposing();
            // this.removeAll();
            super.dispose();
        }
        else
        {*/
            this.removeAll();
            this.onDisposing();
            this.dispose();
        //}
    }

    protected onAddCustomProperties()
    {

    }

    protected onCreate()
    {
        
    }

    protected onFormat()
    {

    }

    protected onPreRender()
    {
    }

    protected onRender()
    {
    }

    protected onPostRender()
    {
    }

    protected onDisposing()
    {
        
    }
}
