import * as bjs from '@babylonjs/core/Legacy/legacy';
import { SolidParticleMaterial } from './SolidParticleMaterial';
import { Scene } from './Scene';
import { GLSGColor } from './Enums';

export class TextMeshModelLoader 
{
    private static _instance: TextMeshModelLoader;
    private characterMeshes: Map<string,bjs.Mesh> = new Map<string,bjs.Mesh>();
    public isLoaded : boolean = false;

    private textMaterial : SolidParticleMaterial;
    
    private characterPool: Map<string, Array<bjs.InstancedMesh>> = new Map<string, Array<bjs.InstancedMesh>>();
    private expandIndex: number = 0;
    private scene : Scene;

    private characterSet: bjs.TransformNode;

    private constructor()
    {
        
    }

    public async init(scene : Scene)
    {
        if (! this.isLoaded)
        {
            this.scene = scene;
            this.textMaterial = new SolidParticleMaterial("text", scene);
            this.textMaterial.roughness = 0.15;
            this.textMaterial.metallic = 0.35;
            //this.textMaterial.freeze();
            this.characterSet = new bjs.TransformNode("Character Set", scene.bjsScene);
            await this.loadMeshes(scene.bjsScene);
            this.isLoaded = true;
        }
            
    }

    async loadMeshes(scene : bjs.Scene)
    {
        // let asset : GLSGAsset | undefined = AssetManager.Instance.getAsset("Font_Conthrax_New");

        // if (asset)
        // {
           
            // let fontMeshes : Array<bjs.Mesh> | undefined = asset.meshes;
            const mesh = await bjs.SceneLoader.ImportMeshAsync(null, "/", 'Font_Conthrax_New.babylon', this.scene.bjsScene);
            let fontMeshes = mesh.meshes;

            if (fontMeshes)
            {
                // console.log("TextMeshModelLoader - Loading " + fontMeshes?.length + " characters.")
                
                for (let i = 0; i < 10; i++)
                {
                    const fontMesh : bjs.Mesh | undefined = this.configureMesh(fontMeshes[i], scene);

                    if (fontMesh)
                    {
                        this.characterMeshes.set((i).toString(), fontMesh);
                        let individualCharaterPool = new Array<bjs.InstancedMesh>();
                        this.characterPool.set((i).toString(), individualCharaterPool);    
                    }
                }
                
                if (fontMeshes[10])
                {
                    const fontMesh  : bjs.Mesh | undefined= this.configureMesh(fontMeshes[10], scene);

                    if (fontMesh)
                    {
                        this.characterMeshes.set(".", fontMesh);
                        let individualCharaterPool = new Array<bjs.InstancedMesh>();
                        this.characterPool.set(".", individualCharaterPool);
                    }
                }
                
                if (fontMeshes[11])
                {
                    const fontMesh  : bjs.Mesh | undefined= this.configureMesh(fontMeshes[10], scene);

                    if (fontMesh)
                    {
                        this.characterMeshes.set("/", fontMesh);
                        let individualCharaterPool = new Array<bjs.InstancedMesh>();
                        this.characterPool.set("/", individualCharaterPool);
                        this.isLoaded = true;
                    }
                } 
                        
                for (let j = 12; j < 38; j++)
                {
                    const fontMesh : bjs.Mesh | undefined = this.configureMesh(fontMeshes[j], scene);
                    const asciiValueOfA = 65;

                    if (fontMesh)
                    {
                        let currentAsciiValue = asciiValueOfA + (j - 12)
                        let currentCharacter = String.fromCharCode(currentAsciiValue);
                        // console.log("TextMeshModelLoader - Setting " + currentCharacter+ " character.")
                
                        this.characterMeshes.set(currentCharacter, fontMesh);
                        let individualCharaterPool = new Array<bjs.InstancedMesh>();
                        this.characterPool.set(currentCharacter, individualCharaterPool);    
                    }
                }
            }
        // }       
    }

    private configureMesh(abMesh: bjs.AbstractMesh, scene: bjs.Scene) : bjs.Mesh | undefined
    {
        const mesh = abMesh as bjs.Mesh;

        if (!mesh) return undefined;

        //mesh.convertToUnIndexedMesh();
        mesh.material = this.textMaterial;
        mesh.material['disableLighting'] = true;
        mesh.rotation.x = -Math.PI/2;
        mesh.isVisible = false;
        mesh._scene = scene;
        mesh.parent = this.characterSet;
        mesh.alwaysSelectAsActiveMesh = true;
        mesh.registerInstancedBuffer('uv', 4);
        mesh.instancedBuffers.uv = SolidParticleMaterial.getUVSforColor(GLSGColor.Purple);
        //this.scene.glowLayer.addIncludedOnlyMesh(mesh);
        return mesh;
    }
    
    public getCharacterMesh(character : string) : bjs.Mesh | undefined
    {
        if (this.isLoaded)
        {
            if (this.characterMeshes.has(character))
            {
                let characterMesh : bjs.Mesh | undefined = this.characterMeshes.get(character);

                if (characterMesh)
                    return characterMesh;
                else
                    return undefined;
            }       
        }
        return undefined;
    }
    
    public getCharacterInstance(character: string) : bjs.InstancedMesh | undefined
    {
        let individualCharaterPool = this.characterPool.get(character);
        
        if (individualCharaterPool == null || individualCharaterPool == undefined)
            return undefined;
        
        if (individualCharaterPool.length == 0)
        {
            let characterMesh : bjs.Mesh | undefined = this.characterMeshes.get(character);

            if (characterMesh)
                return characterMesh.createInstance(character+"-"+(this.expandIndex++).toString());
        }

        return individualCharaterPool.pop(); 
    }

    public storeCharacterInstance(character: bjs.InstancedMesh) : void
    {
        let key = character.name.split("-")[0];
        let individualCharaterPool = this.characterPool.get(key);

        if (individualCharaterPool)
        {
            character.parent = this.characterSet;
            individualCharaterPool.push(character);
            character.isVisible = false;
        }
    }

    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}
