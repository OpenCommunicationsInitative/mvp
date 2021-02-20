import { AudioSequencer } from "./AudioSequencer";
import { BeatDivision } from "../Enums";
import { AudioClip } from "./AudioClip";

export class AudioSequence
{
    private currentClipIndex : number = 0;

    constructor(public clipBeatDivision : BeatDivision,  public clips : Array<AudioClip>)
    {

    }

    public getNextClip() : AudioClip | undefined
    {
        if (this.currentClipIndex < this.clips.length)
        {
            return this.clips[this.currentClipIndex++];
            
        }
        else
        {
            return undefined;
        }
    }

    public reset()
    {
        this.currentClipIndex = 0;
    }

    public stepCount()
    {
        return this.clips.length;
    }
  
}
