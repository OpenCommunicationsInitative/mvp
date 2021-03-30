import * as bjs from '@babylonjs/core/Legacy/legacy';
import { SceneElement } from './SceneElement';
import { Scene } from './Scene';
import { SolidParticleMaterial } from "./SolidParticleMaterial";
import Logger from '../Utils/Logger';
import { TextMeshString } from './TextMeshString';
import { HorizontalAlignment } from '../Enums';
import { VerticalAlignment, GLSGColor, AnimationState } from './Enums';


export class AnimatedTextMeshString extends SceneElement
{
    private textMesh:TextMeshString
    private animationState : AnimationState = AnimationState.Initial;

    private startingScale : bjs.Vector3 = new bjs.Vector3(0.1,0.1,0.1);
    private shownScale : bjs.Vector3 = new bjs.Vector3(1,1,1);
    private endingScale : bjs.Vector3 = new bjs.Vector3(0,0,0);

    private showLerpFactor : number = 0.2;
    private hideLerpFactor : number = 0.2;
    private showDuration : number = 1000;

    private isEnteringInitialState = true;
    private isEnteringShownState = false;

    private hideTimeout : NodeJS.Timeout;



   
    constructor(
        name: string,
        x: number,
        y: number,
        z: number,
        scene : Scene,
        public text: string,
        public textColor : GLSGColor,
        public textScale : number = 1.0,
        public horizontalAlignment : HorizontalAlignment = HorizontalAlignment.Center,
        public verticalAlignment: VerticalAlignment = VerticalAlignment.Middle,
        public billboardMode  = bjs.Mesh.BILLBOARDMODE_NONE
       
    )
    {
        super(name, x, y, z, scene);
        Logger.log(" AnimatedTextMeshString : Constructor");
        this.name = name;
        this.create();
      
    }


    async create()
    {
        super.create();
        this.textMesh = new TextMeshString(this.text,0,0,0,this.scene,this.text,this.textScale,this.horizontalAlignment,this.verticalAlignment,this.billboardMode);
        this.addChild(this.textMesh);
        this.setColor(this.textColor);
        //this.create();




    }

    public show(text : string, color : GLSGColor = GLSGColor.Aqua)
    {   
        this.reset();
        this.textMesh.setColor(color);
        this.textMesh.setText(text);
        this.animationState = AnimationState.Showing;
    }

    public hide()
    {
        this.animationState = AnimationState.Hiding;
    }


    public setColor(color : GLSGColor)
    {
        this.textMesh?.setColor(color);
    }

    private reset()
    {
        this.scaling = this.startingScale;

        if(this.animationState == AnimationState.Shown)
        {
            clearInterval(this.hideTimeout);
        }
    }
 
    protected onPreRender()
    {
        switch(this.animationState)
        {
            case AnimationState.Initial:
                {
                    if (this.isEnteringInitialState)
                    {
                        this.setEnabled(false);
                        this.scaling = this.startingScale;
                        this.isEnteringInitialState = false;
                    }
                   
                    break;
                }
            case AnimationState.Showing:
                    {
                        if (!this.isEnabled())
                        {
                            this.setEnabled(true);
                        }
                        
                        this.scaling = bjs.Vector3.Lerp(this.scaling,this.shownScale,this.showLerpFactor);

                        if (this.shownScale.x - this.scaling.x < 0.01)
                        {
                            this.isEnteringShownState = true;
                            this.animationState = AnimationState.Shown;
                            
                        }
                        break;
                    }
            case AnimationState.Shown:
                    {
                        if (this.isEnteringShownState)
                        {
                            this.isEnteringShownState = false;
                            this.hideAfterDelay();
                        }
                        break;
                    }
            case AnimationState.Hiding:
            {
                //this.scaling = bjs.Vector3.Lerp(this.scaling,this.endingScale,this.hideLerpFactor);
                this.scaling.y = bjs.Scalar.Lerp(this.scaling.y,this.endingScale.y,this.hideLerpFactor);


                if ( this.scaling.y <= 0.005)
                {
                    //this.scaling = this.startingScale;

                   // this.setEnabled(false);
                   this.isEnteringInitialState = true;
                    this.animationState = AnimationState.Initial;
                    
                }
                break;
            }
                
        }
    }

    private hideAfterDelay()
    {
       this.hideTimeout = setTimeout(() => { this.animationState = AnimationState.Hiding}  , this.showDuration); 
    }

}
