import * as bjs from '@babylonjs/core/Legacy/legacy';
//import 'babylonjs-inspector';
import "@babylonjs/loaders/glTF";
import * as Tone from 'tone/build/esm';
import { StateMachine, Interpreter, Machine, interpret } from 'xstate';
import { SceneFormatType, DockingPosition } from '../SceneGraph/Enums';
import { EventBus } from '../SceneGraph/EventBus';
import { TextMeshModelLoader } from '../SceneGraph/TextMeshModelLoader';
import { Scene } from '../SceneGraph/Scene';
import { UserPanel } from './Elements/UserPanel';
import { ThemeController } from './Elements/Theme/ThemeController';
import { MorningTheme } from './Elements/Theme/MorningTheme';

enum MenuPosition {
    TOP_LEFT = 0,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
};

// The hierarchical (recursive) schema for the states
interface OCICLientSceneSchema
{
    states:
    {
        loading:
        {

        },
        loaded:
        {
            states:
            {
                start_menu:
                {

                },
                playing_game:
                {

                },
                game_over:
                {

                },
                resetting:
                {

                }
            }
        },
    }
}

// The events that the machine handles
type OCICLientSceneEventType =
| { type: 'LOAD_GAME' }
| { type: 'LOAD_GAME_COMPLETE' }
| { type: 'SHOW_START_SCREEN' }
| { type: 'PLAY_GAME' }
| { type: 'RESET_GAME' }
| { type: 'GAME_OVER'}

 // The context (extended state) of the machine
 interface OCICLientSceneContext {
    whyDoWeNeedThis :         number;
  }


export class OCIClientScene extends Scene //implements IMessageBusClient
{
    hemisphericLight : bjs.HemisphericLight | undefined;

    userPanel : UserPanel | undefined;

    private cameraHomeAlpha: number = -Math.PI / 2;
    private cameraHomeBeta: number = Math.PI / 2;
    private cameraStartingRadius: number = 10;
    private cameraHomeRadius: number = 10;



    xr : bjs.WebXRDefaultExperience | undefined;

    private inspectorIsVisible = false;
   
    glowLayer : bjs.GlowLayer;
    themeController : ThemeController;

    private sceneBaseUrl = "/";

    assetsPath: Array<Object> = [
      //  {type: 'mesh', name:'simplecube', url: this.sceneBaseUrl + "/models/", fileName: 'simplecube.babylon'},
      //  {type: 'mesh', name:'SmoothCube', url: this.sceneBaseUrl+ "/models/", fileName: 'SmoothCube.babylon'},
    ];

    private stateMachine: StateMachine<OCICLientSceneContext, OCICLientSceneSchema, OCICLientSceneEventType>;
    private stateMachineService: Interpreter<OCICLientSceneContext, OCICLientSceneSchema, OCICLientSceneEventType>;
    
    constructor(public title: string,
        public canvas: HTMLElement)
    {
        super(title, canvas);


        this.stateMachine = Machine<OCICLientSceneContext, OCICLientSceneSchema, OCICLientSceneEventType>(
            {
                id: "trade_scene",
                initial: "loading",
                states:
                {
                    loading:
                    {
                        id: 'loading',
                        onEntry: 'onEnterLoading',
                        on:
                        {
                            LOAD_GAME_COMPLETE: 'loaded',
                        }
                    },
                    loaded:
                    {
                        initial: 'start_menu',
                        onEntry: 'onEnterLoaded',
                        states:
                        {
                            start_menu:
                            {
                                id: 'start_menu_shown',
                                onEntry: 'onEnterStartMenu',
                                onExit: 'onExitStartMenu',
                                on:
                                {
                                    PLAY_GAME : 'playing_game',
                                }
                            },
                            playing_game:
                            {
                                id: 'playing_game',
                                onEntry: 'onEnterPlayingGame',
                                on:
                                {
                                    GAME_OVER : 'game_over',
                                }
                            },
                            game_over:
                            {
                                id: 'game_over',
                                onEntry: 'onEnterGameOver',
                                on:
                                {
                                    RESET_GAME: 'resetting',
                                }
                            },
                            resetting:
                            {
                                id: 'resetting',
                                onEntry: 'onEnterResetting',
                                on:
                                {
                                    PLAY_GAME: 'playing_game',
                                }
                            }
                              
                        }
                    },
                } //states
            },
            {
                actions: {
                    onEnterLoading: async (ctx, event) =>{
                        console.log("BionicTraderScene : Entering Loading State");
                        // let Settings: any = null;

                    
                        // this.createScene(Settings);
                     
                    },
                    onEnterLoaded: (ctx, event) =>{
                        console.log("BionicTraderScene : Entering Loaded State");
                     
                    },
                    onEnterStartMenu: (ctx, event) =>{
                        console.log("BionicTraderScene : Entering Start Menu State");
                        //show Start Menu
                     
                    },
                    onExitStartMenu: (ctx, event) =>{
                        console.log("BionicTraderScene : Exiting Start Menu State");
                        //Hide StartMenu
                     
                    },
                    onEnterPlayingGame: (ctx, event) =>{
                        console.log("BionicTraderScene : Entering Playing Game State");
                    

                      
                    },
                    onEnterGameOver: (ctx, event) =>{
                        console.log("BionicTraderScene : Entering Game Over State");
                        this.DeleteSceneElement("Depth Finder");
                      

    
                    },
                    onEnterResetting: (ctx, event) =>{
                        console.log("BionicTraderScene : Entering Resetting State");  
                      
                        // this.tradingSession.tradingTimer.show();
                        this.stateMachineService.send("PLAY_GAME");
                    },

                }
            });          
     

        this.stateMachineService = interpret(this.stateMachine);
        this.stateMachineService.start();

        EventBus.Instance.eventHandler.subscribe((p, r) => {
            if (r === 'BEGIN') 
            {
                // this.createFullScreenUI();
                this.stateMachineService.send("PLAY_GAME");
            }
            else if (r === 'CYCLE_THEME')
            {
                this.nextTheme();
            }
            else if (r === 'TIMER_DONE')
            {
                this.stateMachineService.send("GAME_OVER");
            }
            else if (r === 'REPLAY')
            {
                this.stateMachineService.send("RESET_GAME");
            }
            else if (r === 'SWITCH_TO_PORTRAIT')
            {
                if (this.sceneType === SceneFormatType.Landscape)
                {
                    this.format(SceneFormatType.Portrait);
                }
            }
            else if (r === 'SWITCH_TO_LANDSCAPE')
            {
                if (this.sceneType === SceneFormatType.Portrait)
                {
                    this.format(SceneFormatType.Landscape);
                }
            }
        });
    }

    protected async createScene()
    {
        this.glowLayer = new bjs.GlowLayer("glow", this.bjsScene);
      
        await TextMeshModelLoader.Instance.init(this);

   
        this.bjsScene.clearColor = new bjs.Color4(0, 0, 0,1);
        this.hemisphericLight = new bjs.HemisphericLight("sun", new bjs.Vector3(0,1,0), this.bjsScene);   
       
       
        // Configuration Camera
        this.camera.lowerRadiusLimit = 1;   
        this.camera.target = bjs.Vector3.Zero();
        //this.camera.alpha = this.cameraHomeAlpha - Math.PI;
        //this.camera.beta = this.cameraHomeBeta;
        this.camera.radius = this.cameraHomeRadius;
        this.camera.fov = 0.5;
        this.camera.wheelPrecision = 1000;
       
        this.camera.angularSensibilityX = 2000;
        this.camera.angularSensibilityY = 2000;
        this.camera.panningSensibility = 2000;
        // this.camera.layerMask = 0x10000000;

        // Setting up themes and apply default theme
        this.themeController = new ThemeController("Theme Controller",0,0,0,this);
        this.AddSceneElement(this.themeController);

        this.themeController.addTheme("Morning", new MorningTheme("Morning",0,0,0,this)); 
        this.themeController.applyTheme(0);

        //this.camera.upperAlphaLimit = this.camera.alpha + (Math.PI) / 12;
        //this.camera.lowerAlphaLimit = this.camera.alpha - (Math.PI) / 12;
        //this.camera.upperBetaLimit = this.camera.beta + (Math.PI) / 12;
        //this.camera.lowerBetaLimit = this.camera.beta - (Math.PI) / 12;
        //this.camera.lowerBetaLimit = Math.PI / 2 - (Math.PI) / 6;;


        this.userPanel = new UserPanel("User Panel", 0, 0, 0, this);
        this.AddSceneElement(this.userPanel);


    
        /*
        var pipeline = new bjs.DefaultRenderingPipeline(
            "defaultPipeline", // The name of the pipeline
            true, // Do you want the pipeline to use HDR texture?
            this.bjsScene, // The scene instance
            [this.camera] // The list of cameras to be attached to
        );
        */

        //var postProcess = new bjs.BlackAndWhitePostProcess("bandw", 1.0, this.camera);
        //var postProcess = new bjs.FxaaPostProcess("fxaa", 1.0, this.camera);
        
        //this.bjsScene.freezeActiveMeshes();
        this.bjsScene.autoClear = false; // Color buffer
        this.bjsScene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
        this.bjsScene.actionManager = new bjs.ActionManager(this.bjsScene);

        this.bjsScene.actionManager.registerAction(
            new bjs.ExecuteCodeAction(
                {
                    trigger: bjs.ActionManager.OnKeyUpTrigger,
                    parameter: '`'
                },
                this.toggleInspector.bind(this)
            )
        );

        this.xr = await this.bjsScene.createDefaultXRExperienceAsync({
            // floorMeshes: [(this.themeController.themes[0] as DayTheme).water?.water as bjs.Mesh]
        });

        if (this.xr && this.xr.baseExperience) 
        {
            this.xr.baseExperience.onStateChangedObservable.add((state) => {
                switch (state) 
                {
                    case bjs.WebXRState.IN_XR:
                        console.log("WebXRState : IN_XR");
                        // Start XR camera facing forward, not tilt.
                        //xrHelp.baseExperience.camera.rotate
                        //this.xr.baseExperience.camera.setTransformationFromNonVRCamera(this.camera,true);
                        //this.xr.baseExperience.camera.rotationQuaternion = bjs.Quaternion.FromEulerVector(new bjs.Vector3(0,Math.PI/2,0));
                        break;
                }
            });
        }

        // Create PieMenuElement
        // this.createPieMenu();

      

        let aspectRatio = (this.canvas.clientHeight * this.camera.viewport.height) / (this.canvas.clientWidth * this.camera.viewport.width);

        if (aspectRatio > 1)
            this.format(SceneFormatType.Portrait);
        else
            this.format(SceneFormatType.Landscape);

        this.stateMachineService.send("LOAD_GAME_COMPLETE");
    }

    public nextTheme = () => {
        this.themeController.nextTheme();
    }


    protected async setupCamera() 
    {
        this.camera = new bjs.ArcRotateCamera("Camera", 0, 0, 0, new bjs.Vector3(0, 0, 0), this.bjsScene);
        
        if (this.camera && this.bjsScene) { 
            this.camera.attachControl(this.canvas, true);
        }
            
    }

    

    protected async onPreRender()
    {  
     
    }

    protected toggleInspector() : void
    {
        if (this.inspectorIsVisible)
        {
            //this.bjsScene.debugLayer.hide();
            this.inspectorIsVisible = false;
        }
        else
        {
            //this.bjsScene.debugLayer.show({overlay:true});
            this.inspectorIsVisible = true;
        }
    }

    protected onRender()
    {
        
        let aspectRatio = (this.canvas.clientHeight * this.camera.viewport.height) / (this.canvas.clientWidth * this.camera.viewport.width);

        if (aspectRatio < 1) 
        {
            this.camera.fov = 0.5 - ((1 - aspectRatio) * 0.2);
           //4 this.cameraHomeRadius = this.cameraStartingRadius + ((1 / aspectRatio));
            let betaAdjustFactor: number = (1 / aspectRatio) * 2.83;
            //this.cameraHomeBeta = Math.PI / 2 - (Math.PI) / (4 + betaAdjustFactor);

        }
        else if (aspectRatio === 1)
        {
            //this.cameraHomeRadius = this.cameraStartingRadius;
        }
        else 
        {
          //this.camera.radius = this.camera.radius * (1 - aspectRatio * 0.005);
          this.camera.fov = 0.5 + (aspectRatio * 0.6);
        }

        this.camera.alpha = bjs.Scalar.Lerp(this.camera.alpha, this.cameraHomeAlpha, 0.01);
        this.camera.beta = bjs.Scalar.Lerp(this.camera.beta, this.cameraHomeBeta, 0.01);

      
        
    }

    public destroy() {
        this.bjsScene.dispose();
    }

    protected onFormat()
    {
        if (this.sceneType === SceneFormatType.Portrait)
        {
            this.cameraHomeAlpha = -Math.PI / 2;
            this.cameraHomeBeta = Math.PI / 2;
            this.cameraHomeRadius = 6.5;
            this.camera.target = bjs.Vector3.Zero()
            this.camera.alpha = this.cameraHomeAlpha; //Portrait mode
            this.camera.beta = this.cameraHomeBeta;
        }
        else
        {
            this.cameraHomeAlpha = -Math.PI / 2;
            this.cameraHomeBeta = Math.PI / 2;
            this.cameraHomeRadius = 6.5;
            this.camera.target = bjs.Vector3.Zero()
            this.camera.alpha = this.cameraHomeAlpha;
            this.camera.beta = this.cameraHomeBeta;

        }

        this.camera.radius = this.cameraHomeRadius;
    }
}
