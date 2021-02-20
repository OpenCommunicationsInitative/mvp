import * as bjs from '@babylonjs/core/Legacy/legacy';
import { morningSkyRippleEnv } from '../../../Assets/AssetList';
import { AssetManager } from "../../../SceneGraph/AssetManager";
import { SceneFormatType } from '../../../SceneGraph/Enums';
import { Theme } from "./Theme";
import { OCIClientScene } from '../../OCIClientScene';

export class MorningTheme extends Theme
{
    //cloudCorridor : CloudCorridor;
    //cloudMesh : bjs.Mesh;
    cloudMaterial : bjs.PBRMaterial = new bjs.PBRMaterial("Cloud", this.scene.bjsScene);
  
    constructor(public name:string,
        public x: number,
        public y: number,
        public z: number,
        public scene : OCIClientScene
        )
    {
        super(name,x,y,z,scene);
    }

    protected onCreate()
    {
        super.onCreate();
        this.settings.skyboxTexturePath = morningSkyRippleEnv;
       

         //   if (this.waterFloor)
         //       this.waterFloor.addMeshToWater(this.icebergCorridor.sps.mesh);
    }

    protected onApply()
    {
        super.onApply();
      

        this.skybox.rotation.y  = (Math.PI/2 *3);
        this.skybox.position.y = -25;

        /*
        this.scene.bjsScene.imageProcessingConfiguration.toneMappingEnabled = true;
        this.scene.bjsScene.imageProcessingConfiguration.toneMappingType = bjs.ImageProcessingConfiguration.TONEMAPPING_ACES;
        this.scene.bjsScene.imageProcessingConfiguration.exposure = 1.5;

        var postProcess = new bjs.ImageProcessingPostProcess("processing", 1.0, this.scene.camera);
        postProcess.contrast = 1.5;
        postProcess.exposure = 1.5;
        */
    }

    protected onRemove()
    {
       // this.removeChild(this.cloudCorridor);
       // this.cloudCorridor.dispose();
    }
}

