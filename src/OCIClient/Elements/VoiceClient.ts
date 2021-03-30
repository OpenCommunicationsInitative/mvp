import Peer from "peerjs";
import { SceneElement } from "../../SceneGraph/SceneElement";
import { OCIClientScene } from '../OCIClientScene';

export class VoiceClient extends SceneElement
{

    voicePeer : Peer;
    serverUrl : string = ""

    constructor(public name: string,
                public x: number,
                public y: number,
                public z: number,
                public scene: OCIClientScene)
    {
        super(name, x, y, z, scene);
    }

    public connect()
    {
        this.voicePeer = new Peer('james', {
            host: 'localhost',
            port: 9000,
            path: '/oci'
          });

    }

    public disconnect()
    {
        if (this.voicePeer != undefined)
            this.voicePeer.disconnect();
    }

}