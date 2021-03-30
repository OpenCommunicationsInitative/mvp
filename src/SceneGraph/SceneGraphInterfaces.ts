import * as bjs from '@babylonjs/core/Legacy/legacy';
import { VectorField } from './VectorField';
import { DockingPosition, SceneFormatType } from './Enums';

export interface IExperience
{
    title: string;
    canvas : any;
    scenes : Array<IScene>;

    load(): void;
    unload(): void;
}

export interface IScene
{
    title: string;
    canvas : any;
    bjsScene : bjs.Scene | undefined;
    camera : bjs.Camera
    sceneElements : Array<ISceneElement>;

    format(type: SceneFormatType): void;

    preRender(): void;
    render(): void;
}

export interface ISceneElement
{
    scene : IScene
    name : string;
    sceneElements : Array<ISceneElement>;

    addChild(element : ISceneElement): void;

    format(): void;

    preRender() : void;
    render() : void;
    postRender() : void;
}

export interface IPresenterUpdateMessage
{

}

export interface IPresenterData
{

}

export interface IActiveModel<P extends ISceneElementPresenter<IPresenterUpdateMessage>>
{
    presenter : P;
    updateInterval : number;

    start() : void;
    stop() : void;
}

export interface ISceneElementPresenter<M extends IPresenterUpdateMessage>
{
    updatePresenter(message : M) : void;
}


export interface ISceneDataSource
{
    dataSink : ISceneDataSink | undefined;
    
    subscribe(sink : ISceneDataSink): void;
}

export interface ISceneDataSink
{
    dataSource : ISceneDataSource | undefined;

    connectDataSource(): void;
    onDataSourceUpdated(): void;
}

export interface IMessageBusMessage
{
    topic: string;
    message: string;
}

export interface IMessageBus
{
    link:IMessageBusLink;

    connect(apikey : string, clientId: string): void;
    disconnect(): void;
    joinChannel(channelName : string): void;
    sendMessage(topic: string, message: string): void;
}

export interface IMessageBusLink    
{ 
    connect(apikey : string, clientId: string): void;
    disconnect(): void;
    scene:IScene;
    processEvent(eventName:string, eventData:string): void;
}

export interface IMessageBusClient
{
    gameLink : IMessageBusLink
    bionicTraderLink : IMessageBusLink
}

export interface ITextMeshCharacterGenerator
{
    characterMeshes : Map<string,bjs.InstancedMesh>;
    addCharacterMesh(character : string, mesh : bjs.Mesh): void;
    setCharacter(character: string): void;
}

export interface ITextMeshString
{
    characterMeshes : Array<bjs.InstancedMesh>;
}

export interface ITextMeshNumberGenerator
{
    maxLength : number;
    characterGenerators : Array<ITextMeshCharacterGenerator>;
    setText(text : string): void;
}

export interface IVectorFieldUpdateStrategy
{
    vectorField : VectorField;
    preCalculate(): void;
    updateParticle(particle : bjs.SolidParticle): void;
}

export interface IDepthFinderElement
{
    rowCount : number;
    columnCount : Number;
    cellWidth : number;
    cellHeight : number;
    cellDepth : number;
    cellMeshScaleFactor : number;
}

export interface IPanel
{
    hasHeader: boolean;
    panelPlane: bjs.Mesh | undefined;
}

export interface ILayer
{
    name: string;
    distance: number;

    topLeft: bjs.Vector3;
    topRight: bjs.Vector3;
    bottomLeft: bjs.Vector3;
    bottomRight: bjs.Vector3;

    getFourCorners(): void;
    setLayout(): void;
    setLayerParams(aspectRatio: number, tangentRate: number): void;
}

export interface IUIControl
{
    name: string;
    dockingPosition: DockingPosition;
    
    moveable: boolean;
    resizable: boolean;
    collapsible: boolean;
    isDocked: boolean;

    offset: bjs.Vector3;
    width: number;
    height: number;

    setPosition(position: bjs.Vector3): void;
    getBounding(): bjs.Vector2;
}

export interface IVectorFieldUpdateStrategy
{
    vectorField : VectorField;
    preCalculate() : void;
    updateParticle(particle : bjs.SolidParticle) : bjs.SolidParticle;
}

export interface ITextMeshCharacterGenerator
{
    characterMeshes : Map<string,bjs.InstancedMesh>;
    addCharacterMesh(character : string, mesh : bjs.Mesh) : void;
    setCharacter(character: string) : void;
}

export interface ITextMeshStringGenerator
{
    maxLength : number;
    characterGenerators : Array<ITextMeshCharacterGenerator>;
    setText(text : string) : void
}

export interface ISettings {
    majorVersion: number;
    minorVersion: number;
}