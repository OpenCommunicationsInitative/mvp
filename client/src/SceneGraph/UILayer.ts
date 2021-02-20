import * as bjs from '@babylonjs/core/Legacy/legacy';
import { Scene } from './Scene';
import { SceneElement } from './SceneElement';
import Logger from '../Utils/Logger';
import { ViewportPosition, DockingPosition, SceneFormatType } from "./Enums";
import { EventBus } from './EventBus';
import { ILayer } from './SceneGraphInterfaces';
import { UIControl } from './UIControl';

export class UILayer extends SceneElement implements ILayer
{
   
    controls: Map<string, UIControl> = new Map<string, UIControl>(); 
    
    public topLeft: bjs.Vector3 = new bjs.Vector3(0,0,0);
    public bottomLeft: bjs.Vector3 = new bjs.Vector3(0,0,0);
    public topRight: bjs.Vector3 = new bjs.Vector3(0,0,0);
    public bottomRight: bjs.Vector3 = new bjs.Vector3(0,0,0);

    public center: bjs.Vector3 = new bjs.Vector3(0,0,0);

    public aspectRatio: number = 1;
    public tangentRate: number = 1;

    constructor(name:string, 
        public x: number,
        public y: number,
        public z: number,
        public scene: Scene,
        public distance: number)
    {   
        super(
            name,
            x,
            y,
            z,
            scene
        );
        // this.create();
    }
    
    async create() 
    {
        super.create();
        
        this.scene.bjsScene.onBeforeRenderObservable.add(() => {
            this.getFourCorners();
        });
    }

    public addUIControl(control: UIControl)
    {
        this.controls.set(control.name, control);
        this.addChild(control);
    }

    public removeUIControl(name: string)
    {

    }
    
    public getFourCorners()
    {
        // let fov = this.scene.camera.fov;
        // let tangentRate = Math.tan(fov / 2);
        // let aspectRatio = this.scene.bjsScene.getEngine().getAspectRatio(this.scene.camera);
        let y = this.distance * this.tangentRate;
        let x = y * this.aspectRatio;

        this.topLeft = new bjs.Vector3(-x, y, this.distance);
        this.topRight = new bjs.Vector3(x, y, this.distance);
        this.bottomLeft = new bjs.Vector3(-x, -y, this.distance);
        this.bottomRight = new bjs.Vector3(x, -y, this.distance);

        this.center = new bjs.Vector3(2*x, 2*y, this.distance);
    }

    public setLayout()
    {
        if (this.topLeft && this.topRight && this.bottomLeft && this.bottomRight) 
        {
            this.controls.forEach(control => { 
                let boundingInfo = control.getBounding();
                
                if (boundingInfo) 
                {
                    let dockingPosition: DockingPosition = control.dockingPosition;
                    let radius = (this.scene.sceneType === SceneFormatType.Portrait) ? 42: 85;
                    let distBaseScale = this.distance / radius; //this.distance / this.scene.camera.radius;

                    let halfWidth = boundingInfo.x / 2 * distBaseScale;
                    let halfHeight = boundingInfo.y / 2 * distBaseScale;
                    let position = new bjs.Vector3();

                    position.z = this.distance;

                    switch(dockingPosition)
                    {
                        case DockingPosition.NORTH_EAST:
                            position.x = this.topLeft.x + halfWidth + control.offset.x;
                            position.y = this.topLeft.y - halfHeight - control.offset.y;
                            break;
                        case DockingPosition.NORTH_WEST:
                            position.x = this.topRight.x - halfWidth - control.offset.x;
                            position.y = this.topRight.y - halfHeight - control.offset.x;
                            break;
                        case DockingPosition.SOUTH_EAST:
                            position.x = this.bottomLeft.x + halfWidth + control.offset.x;
                            position.y = this.bottomLeft.y + halfHeight + control.offset.y;
                            break;
                        case DockingPosition.SOUTH_WEST:
                            position.x = this.bottomRight.x - halfWidth - control.offset.x;
                            position.y = this.bottomRight.y + halfHeight + control.offset.y;
                            break;
                        case DockingPosition.NORTH:
                            position.y = this.topLeft.y - halfHeight - control.offset.y;
                            break;
                        case DockingPosition.SOUTH:
                            position.y = this.bottomLeft.y + halfHeight + control.offset.y;
                            break;
                        case DockingPosition.EAST:
                            position.x = this.topLeft.x + halfWidth + control.offset.x;
                            break;
                        case DockingPosition.WEST:
                            position.x = this.topRight.x - halfWidth - control.offset.x;
                            break;
                        case DockingPosition.CENTER:
                            position.x = 0;
                            position.y = 0;
                            break;
                        default:
                            break;
                    }

                    control.setPosition(position);
                }
            });

            this.onFormat();
        }
    }

    public setLayerParams(aspectRatio: number, tangentRate: number)
    {
        this.aspectRatio = aspectRatio;
        this.tangentRate = tangentRate;
    }
    
    protected onPreRender()
    {
        this.setLayout();
    }
}
