// import * as DotEnv from 'dotenv';
// DotEnv.config();

// console.log('initial process env_________________');
// console.log(process);

import * as Tone from 'tone/build/esm';
import Game from "./Game";
import { router, createCanvasElement } from "./router";

import StartAudioContext from 'startaudiocontext';
import './styles/style.scss';
import { OCIClientScene } from './OCIClient/OCIClientScene';

// Load proper scene by route.
let game: any;
let hidden: string = "hidden";
let visibilityChange: string = "visibilitychange";

try {
    StartAudioContext(Tone.context, "#canvasArea").then(async () => {
        try {
            await Tone.start();
        } catch (err) {
            alert('error when start tone');
        }
    });
} catch (error) {
    alert('error has happened');
}
    
const canvasRenderer = (event: Event) => {
    window.scrollTo(0,1);
    router(event);

    const url: string = window.location.hash.slice(1) || "/";
    console.log('location_______________________', window.location);
    const path = url.split('?')[0];
    const queryString = url.split('?')[1];

    // Initialize canvas element
    const canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const canvasContainer: HTMLDivElement = document.getElementById("canvasArea") as HTMLDivElement;

    if (canvas) {
        canvasContainer.removeChild(canvas);
    }

    if (path !== "/") {
        if (path === '/signup' || path.includes('/verifyEmail') || path === '/signin') {
            const loadingElement: HTMLImageElement = document.getElementById("loading-wrapper") as HTMLImageElement;
            if (loadingElement) {
                loadingElement.style.display = "none";
            }

            const buttonContainers = document.getElementsByClassName("buttons-container");
            for (let i=0; i< buttonContainers.length; i+=1) {
                const htmlElement: HTMLElement = buttonContainers[i] as HTMLElement;
                htmlElement.style.display = "none";
            }

            if (url === '/signup') {
               
            } else if (url.includes('/verifyEmail')) {
             
            } else if (url === '/signin') {
                
            }
        } else {
            setTimeout(() => {
                const loadingElement: HTMLImageElement = document.getElementById("loading-wrapper") as HTMLImageElement;

                if (loadingElement) {
                    loadingElement.style.display = "none";
                }
            }, 4500);
            //const exampleTitleElement: HTMLDivElement = document.getElementById("exampleTitle") as HTMLDivElement;
            //exampleTitleElement.style.display = "none";

            const canvasRender: HTMLCanvasElement = createCanvasElement();
            canvasContainer.appendChild(canvasRender);

            var canvas_dom = canvasContainer;
            canvas_dom.addEventListener("touchstart",  function(event) {event.preventDefault()})
            canvas_dom.addEventListener("touchmove",   function(event) {event.preventDefault()})
            canvas_dom.addEventListener("touchend",    function(event) {event.preventDefault()})
            canvas_dom.addEventListener("touchcancel", function(event) {event.preventDefault()})

            game = new Game('renderCanvas', path);
            listenVisibilityChange();
        }
    } else {
        // const loadingElement: HTMLImageElement = document.getElementById("loading-wrapper") as HTMLImageElement;
        // if (loadingElement) {
        //     loadingElement.style.display = "none";
        // }

        // canvasContainer.innerHTML = startTemplate;
        // const startHandler = new Start();
        window.location.replace(window.location.href + '#/bionic-trader');
    }
}

const listenVisibilityChange = () => {
    // Listen for visibility change 
    if (typeof document['hidden'] !== "undefined") 
    { // Opera 12.10 and Firefox 18 and later support 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } 
    else if (typeof document['msHidden'] !== "undefined") 
    {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } 
    else if (typeof document['webkitHidden'] !== "undefined") 
    {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    else 
    {
        hidden = "";
    }

    if (typeof document.addEventListener === "undefined" || hidden === "") 
    {
        console.log("This requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } 
    else 
    {
        // Handle page visibility change   
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
}

const handleVisibilityChange = () => {
    if (game.experience && game.experience != undefined) 
    {
        game.scene = (game.experience.scenes[0]) as OCIClientScene;
    }
                
    if (game.scene && game.scene != undefined) 
    {
        if (game.scene.depthFinder != undefined) 
        {
            if (game.scene.depthFinder.tradeReportPlotter != undefined) 
            {
                const active: number = document[hidden] ? 0 : 1;
                game.scene.depthFinder.tradeReportPlotter.setActive(active);
            }
        }    
    }
}

// For first load or when routes are changed in browser url box.
window.addEventListener('load', canvasRenderer);
window.addEventListener('hashchange', canvasRenderer);
