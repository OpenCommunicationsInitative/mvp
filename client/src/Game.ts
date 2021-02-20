import * as bjs from '@babylonjs/core/Legacy/legacy';
import Amplify, { Auth } from 'aws-amplify';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.scss';
import { Experience } from "./SceneGraph/Experience";
import { SceneManager } from "./SceneGraph/SceneManager";
import { EventBus } from './SceneGraph/EventBus';
import { OciClientExperience } from './OCIClient/OCIClientExperience';
import { OCIClientScene } from './OCIClient/OCIClientScene';

type LoadAssetHandler = (arg1: bjs.AbstractAssetTask[]) => void;
bjs.Database.IDBStorageEnabled = true;

export default class Game
{
    private canvas: HTMLCanvasElement;
    private experience: Experience;
    private isVideoExpanded: boolean = false;

    constructor(canvasElement: string, path: string)
    {
        this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;

        const authSettings = {
            mandatorySignIn: false,
            userPoolId: process.env.USER_POOL_ID,
            region: process.env.COGNITO_REGION,
            userPoolWebClientId:  process.env.USER_POOL_WEB_CLIENT_ID
        }

        try {
            Amplify.configure({
                Auth: authSettings
            });
        } catch (error) {
            console.log('aws error: ', error);
        }

        if (document) {
            const nextButton = document.getElementById("nextButton") as HTMLButtonElement;
            const prevButton = document.getElementById("prevButton") as HTMLButtonElement;
            const startButton = document.getElementById("btnStart") as HTMLImageElement;
            const embedVideoPlayer: HTMLDivElement = document.getElementById("embedPlayerContainer") as HTMLDivElement;
            const embedVideoPlayerButton = document.getElementById("embedPlayerContainerButton") as HTMLButtonElement;
            const themeCycleButton = document.getElementById("themeButton") as HTMLButtonElement;
            const exitButton = document.getElementById("exitButton") as HTMLButtonElement;

            if (embedVideoPlayerButton) {
                embedVideoPlayerButton.addEventListener('click', e => {
                    if (this.isVideoExpanded) {
                        embedVideoPlayer.className = "embedPlayerContainerClose";
                        this.isVideoExpanded = false;
                    } else {
                        embedVideoPlayer.className = "embedPlayerContainerOpen";
                        this.isVideoExpanded = true;
                    }
                });
            }

            if (nextButton) {
                nextButton.addEventListener("click", () => {
                    EventBus.Instance.emit('NEXT_CLICK');
                });
            }

            if (prevButton) {
                prevButton.addEventListener("click", () => {
                    EventBus.Instance.emit('PREV_CLICK');
                });
            }

            if (startButton) {
                startButton.addEventListener("click", () => {
                    console.log('click begin button__________________________');
                    startButton.style.display = "none";
                    EventBus.Instance.emit('BEGIN');
                })
            }

            if (themeCycleButton) {
                themeCycleButton.addEventListener("click", () => {
                    EventBus.Instance.emit('CYCLE_THEME');
                });
            }

            if (exitButton) {
                exitButton.addEventListener("click", () => {
                    EventBus.Instance.emit('EXIT_GAME');
                });
            }

            /*
            const fullButton = document.getElementById("fullButton") as HTMLButtonElement;

            if (fullButton) {
                fullButton.addEventListener("click", () => {
                    console.log('clicked full screen button');
                    const canvas: any = document.getElementById("canvasArea");
                    // const canvas: any = document.getElementById("renderCanvas");
                    
                    if (canvas.requestFullscreen) {
                        canvas.requestFullscreen();
                    } else if (canvas.mozRequestFullScreen) { // Firefox 
                        canvas.mozRequestFullScreen();
                    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari & Opera 
                        canvas.webkitRequestFullscreen();
                    } else if (canvas.msRequestFullscreen) { // IE/Edge 
                        canvas.msRequestFullscreen();
                    }

                    const myDocument: any = document;
                    if (myDocument.exitFullscreen) {
                        myDocument.exitFullscreen();
                    } else if (myDocument.mozCancelFullScreen) { // Firefox 
                        myDocument.mozCancelFullScreen();
                    } else if (myDocument.webkitExitFullscreen) { // Chrome, Safari & Opera 
                        myDocument.webkitExitFullscreen();
                    } else if (myDocument.msExitFullscreen) { // IE/Edge
                        myDocument.msExitFullscreen();
                    }
                });
            }
            */

            document.addEventListener('fullscreenchange', (event) => {
                // document.fullscreenElement will point to the element that
                // is in fullscreen mode if there is one. If there isn't one,
                // the value of the property is null.
                if (document.fullscreenElement) {
                  console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
                } else {
                  console.log('Leaving full-screen mode.');
                }

                let scene: OCIClientScene | undefined;
                if (this.experience && this.experience != undefined) 
                {
                    scene = (this.experience.scenes[0]) as OCIClientScene;
                }
            });

            /*
            window.addEventListener("orientationchange", function(event) {
                console.log("the orientation of the device is now " + window.screen.orientation.angle);
                console.log("mode:",window.orientation);
                console.log("mode1:",screen.orientation);

                if ( window.orientation == 0 || window.orientation == 180) {
                    // WHEN IN PORTRAIT MODE
                } 
                else {
                    // WHEN IN LANDSCAPE MODE
                }

                if (window.matchMedia("(orientation: portrait)").matches) {
                    console.log("PORTRAIT")
                }

                if (window.matchMedia("(orientation: landscape)").matches) {
                    console.log("LANSCAPE")
                }

                switch (window.orientation) {
                    case -90:
                    case 90:
                    // landscape
                    break;
                    default:
                    // portrait
                    break;
                }
            });
            */
            
           var mql = window.matchMedia("(orientation: portrait)");

            // If there are matches, we're in portrait
            if (mql.matches) {  
               // Portrait orientation
               // console.log('portrait in first time');
               EventBus.Instance.emit('SWITCH_TO_PORTRAIT');
            } else {  
               // Landscape orientation
               // console.log('landscape in first time');
               EventBus.Instance.emit('SWITCH_TO_LANDSCAPE');
            }

            window.addEventListener("orientationchange", function(event) {
            
                if ( window.orientation == 0 || window.orientation == 180) {
                    // WHEN IN PORTRAIT MODE
                    // console.log('in portrait mode');
                    EventBus.Instance.emit('SWITCH_TO_PORTRAIT');
                } 
                else if (window.orientation == 90 || window.orientation == -90) {
                    // WHEN IN LANDSCAPE MODE
                    // console.log('in landscape mode');
                    EventBus.Instance.emit('SWITCH_TO_LANDSCAPE');
                }
            });

            window.addEventListener('resize', function() {
                if (window.innerWidth > window.innerHeight) {
                  // landscape
                  // console.log('landscape mode');
                  EventBus.Instance.emit('SWITCH_TO_LANDSCAPE');
                } else {
                  // portrait
                  // console.log('portrait mode');
                  EventBus.Instance.emit('SWITCH_TO_PORTRAIT');
                }
            }, false);

            /*
            const togglePanelButton = document.getElementById("togglePanelButton") as HTMLButtonElement;

            if (togglePanelButton) {
                togglePanelButton.addEventListener("click", () => {
                    let toggleButtonImg = document.getElementById('toggleButtonImg') as HTMLImageElement;
                    if (toggleButtonImg) {
                        let scene: BionicTraderScene | undefined;
                        let isVisible: boolean = false;

                        if (this.experience && this.experience != undefined) 
                        {
                            scene = (this.experience.scenes[0]) as BionicTraderScene;
                        }

                        if (toggleButtonImg.className === "stat-off") 
                        {
                            toggleButtonImg.className = "stat-on";
                            toggleButtonImg.src = "src/Assets/Trading_Hide.png";
                            isVisible = true;
                        }
                        else 
                        {
                            toggleButtonImg.className = "stat-off";
                            toggleButtonImg.src = "src/Assets/Trading_Show.png";
                            isVisible = false;
                        }

                    }
                });
            }
            */

           
            const signInButton = document.getElementById("signInButton") as HTMLButtonElement;

            if (signInButton) {
                signInButton.addEventListener("click", () => {
                    window.location.replace(window.location.origin + '/#/signin');
                });
            }
        }

        // Clear all existing scenes
        SceneManager.Instance.clear();

        // Create Mesh Asset Manager
        // console.log(AssetManager.Instance.addMeshTask);

        this.customizedLoading();
        console.log('path___________________: ', path);

        switch (path) {
            case '/':
                // Handler for root route
                break;
            case '/bionic-trader':
                this.experience = new OciClientExperience('OCI Client Experience', this.canvas,true);
                this.experience.load();
                break;
            case '/BionicTrader':
                this.experience = new OciClientExperience('OCI Client Experience', this.canvas,true);
                this.experience.load();
                break;
            default:
                break;
        }
        
        
        // Listen for browser/canvas resize events
        window.addEventListener("resize", ()=> {
            // Handle changes for resize
        });
    }

    public customizedLoading()
    {
        bjs.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
            if (this._loadingDiv) {
                // Do not add a loading screen if there is already one
                return;
            }

            this._loadingDiv = document.createElement("div");
            this._loadingDiv.id = "glsgLoadingDiv";
            
            // Loading text
            this._loadingTextDiv = document.createElement("div");
            this._loadingTextDiv.id = "glsgLoadingTextDiv";
            this._loadingTextDiv.innerHTML = "Loading";
            this._loadingDiv.appendChild(this._loadingTextDiv);

            //set the predefined text
            this._loadingTextDiv.innerHTML = this._loadingText;

            // Generating keyframes
            const style = document.createElement('style');
            style.type = 'text/css';
            const keyFrames = "@-webkit-keyframes spin1 { 0% { -webkit-transform: rotate(0deg);}\n                    100% { -webkit-transform: rotate(360deg);}\n                }                @keyframes spin1 {                    0% { transform: rotate(0deg);}\n                    100% { transform: rotate(360deg);}\n                }";
            style.innerHTML = keyFrames;
            document.getElementsByTagName('head')[0].appendChild(style);

            // Loading img
            const imgBack = new Image();
            imgBack.src = "../src/Assets/Logo_spin.png";
            imgBack.id = "backgroundImage";
            this._loadingDiv.appendChild(imgBack);

            this._resizeLoadingUI();

            window.addEventListener("resize", this._resizeLoadingUI);
            this._loadingDiv.style.backgroundColor = this._loadingDivBackgroundColor;
            document.body.appendChild(this._loadingDiv);
            this._loadingDiv.style.opacity = "1";
        };
    }
}
