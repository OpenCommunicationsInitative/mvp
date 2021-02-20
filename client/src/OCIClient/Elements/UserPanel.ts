import * as bjs from '@babylonjs/core/Legacy/legacy';
import { GUI3DManager, HolographicButton, PlanePanel, MeshButton3D } from '@babylonjs/gui';
import { SceneFormatType } from '../../SceneGraph/Enums';
import { Scene } from '../../SceneGraph/Scene';
import { SceneElement } from '../../SceneGraph/SceneElement';

export class UserPanel extends SceneElement
{
    manager : GUI3DManager;
    panel : PlanePanel;
    anchor : bjs.Nullable<bjs.TransformNode> = new bjs.TransformNode("");

    itemMesh : bjs.Mesh;

    pushButtonCore :bjs.Mesh;
    buttonIndex : number = 0;

    constructor(public name: string,
        public x: number,
        public y: number,
        public z: number,
        public scene: Scene)
    {
        super(name,
            x,
            y,
            z,
            scene);

        this.create();
    }

    async onCreate()
    {

       //this.itemMesh = bjs.MeshBuilder.CreateTorus("torus", {thickness: 0.25, diameter: 2});

        if (this.anchor)
            this.anchor.parent = this;


        this.manager = new GUI3DManager();
        this.panel = new PlanePanel();
        this.panel.margin = 0.2;
        this.manager.addControl(this.panel);
        this.panel.linkToTransformNode(this);
        this.panel.position.z = -1.5;
        this.panel.blockLayout = true;
        this.panel.columns = 3;

        bjs.SceneLoader.ImportMesh("", "https://david.blob.core.windows.net/babylonjs/MRTK/", "pushButton.glb", this.scene.bjsScene, (newMeshes) => {
            this.pushButtonCore = newMeshes[0] as bjs.Mesh;
            this.makePushButtons();
            this.pushButtonCore.setEnabled(false);
        });

        /*
        for (let index:number = 0; index < 12; index++)
        {
            let itemMesh : bjs.Mesh = bjs.MeshBuilder.CreateTorus("torus", {thickness: 0.1, diameter: 0.5});
            itemMesh.rotate(bjs.Axis.X, Math.PI/2, bjs.Space.LOCAL);
            let button : MeshButton3D = new MeshButton3D(itemMesh,"item");
            button.mesh?.rotate(bjs.Axis.X, Math.PI/2, bjs.Space.LOCAL);
            this.panel.addControl(button);
            //button.text = "User #" + this.panel.children.length;   
        }
        */
    }

    protected onFormat()
    {
        if (this.scene.sceneType === SceneFormatType.Portrait)
        {
           
        }
        else
        {
          
        }
    }

    protected onRender()
    {
       
    }

    makePushButton(mesh, hoverColor) {
        var cylinder = mesh.getChildMeshes(false, (node) => { return node.name.indexOf("Cylinder") !== -1 })[0];
        var cylinderMat = cylinder.material.clone();
        cylinder.position.y = 0
        cylinderMat.albedoColor = new bjs.Color3(0.5, 0.19, 0);
        cylinder.material = cylinderMat;
        var pushButton = new MeshButton3D(mesh, "pushButton" + this.buttonIndex);
        pushButton.pointerEnterAnimation = () => {
            cylinder.material.albedoColor = hoverColor;
        };
        pushButton.pointerOutAnimation = () => {
             cylinder.material.albedoColor = new BABYLON.Color3(0.5, 0.19, 0);
        };
        pushButton.pointerDownAnimation = () => {
            cylinder.position.y = 0;
        }
        pushButton.pointerUpAnimation = () => {
            cylinder.position.y = 0;
        }
        pushButton.onPointerDownObservable.add(() => {
            console.log(pushButton.name + " pushed.");
        });
        this.panel.addControl(pushButton);
        this.buttonIndex++;
    }

    makePushButtons()
    {
        var color;
        var newPushButton;
        var colors = [{r: 0.25, g:0, b:0}, {r: 0, g:0.25, b:0}, {r: 0, g:0, b:0.25},
                      {r: 0.25, g:0.25, b:0}, {r: 0, g:0.25, b:0.25}, {r: 0.25, g:0, b:0.25}];

        this.panel.blockLayout = true;
        this.panel.columns = 3;
        for (var i = 0; i < 12; i++) {
            console.log("Making Button : " + i)
            let newPushButton : bjs.Mesh = this.pushButtonCore.clone("pushButton" + this.buttonIndex);
            let color : bjs.Color3 = new bjs.Color3(colors[i % 6].r, colors[i % 6].g, colors[i % 6].b);
            this.makePushButton(newPushButton, color);
        }
        this.panel.blockLayout = false;
    }

}
