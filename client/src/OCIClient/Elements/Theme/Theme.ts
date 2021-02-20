
import * as bjs from '@babylonjs/core/Legacy/legacy';
import { SceneElement } from '../../../SceneGraph/SceneElement';
import { OCIClientScene } from '../../OCIClientScene';

export class ThemeSettings
{
    skyboxTexturePath: string = "";
    lutTexturePath: string = "";
}

export abstract class Theme extends SceneElement
{
    settings : ThemeSettings = new ThemeSettings();
    skybox : bjs.Mesh;
    skyboxMaterial : bjs.StandardMaterial;
    skyBoxCubeTexture: bjs.CubeTexture | undefined;
    // water : WaterFloor | undefined;

    constructor(public name:string,
                public x: number,
                public y: number,
                public z: number,
                public scene : OCIClientScene
                )
            {
                super(name,x,y,z,scene);
                this.create();
                //this.apply();
            }

    public apply()
    {
        this.makeSkybox();
        // this.water = new WaterFloor("Water",0,0,0,this.scene);
        // this.addChild(this.water);
        // this.water.addMeshToWater(this.skybox);
        // this.addMeshToWater(this.scene.depthFinder?.hud?.frame as bjs.Mesh);
         this.onApply();
    }
    
    public remove()
    {
        this.skybox.dispose();
        //this.skyboxMaterial.dispose();
        
        // this.removeChild(this.water as WaterFloor);
        // this.water?.dispose();

        this.skyBoxCubeTexture?.dispose();
        this.onRemove();
    }

    protected onRemove()
    {

    }

    protected onApply()
    {
        /*
        if (this.scene.sceneType === SceneFormatType.Portrait)
        {
            this.water?.setEnabled(false);
        }
        else
        {
            this.water?.setEnabled(true);
        }
        */
    }

    public addMeshToWater(mesh : bjs.Mesh)
    {
        /*
        if (this.water)
            this.water.addMeshToWater(mesh);
        */
    }
        
    protected onCreate()
    {
        /*
        EventBus.Instance.eventHandler.subscribe((p, r) => {
            if (r === 'BEGIN') {
                this.apply();
            }
        });
        */
    }

    protected onFormat()
    {
        /*
        if (this.scene.sceneType === SceneFormatType.Portrait)
        {
            this.water?.setEnabled(false);
        }
        else
        {
            this.water?.setEnabled(true);
        }
        */
    }

    protected onRender()
    {
       
    }

    private makeSkybox()
    {
        if(this.settings.skyboxTexturePath)
        {
            this.skyBoxCubeTexture = bjs.CubeTexture.CreateFromPrefilteredData(this.settings.skyboxTexturePath, this.scene.bjsScene);

            this.scene.bjsScene.environmentTexture = this.skyBoxCubeTexture;
            this.generateSkybox(1000,this.skyBoxCubeTexture);
            this.scene.hdrSkybox = this.skybox;
        }
    }

    private generateSkybox(_size: number, hdrTexture: bjs.CubeTexture)
    {
        this.skybox = bjs.Mesh.CreateBox("hdrSkyBox", 1000.0, this.scene.bjsScene);
        const hdrSkyboxMaterial: bjs.StandardMaterial = new bjs.StandardMaterial("skyBox", this.scene.bjsScene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = bjs.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.disableLighting = true;
        this.skybox.material = hdrSkyboxMaterial;
        this.skybox.infiniteDistance = true;
        this.skybox.rotation.y = (2 * Math.PI) / 2;
       
        this.skybox.parent = this;

        this.skybox.parent = this;
    }   
    
}