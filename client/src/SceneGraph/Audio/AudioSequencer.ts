import { AudioEvent, BeatDivision } from '../Enums';
import { AudioClip } from "./AudioClip";
import { AudioSequence } from './AudioSequence';
import { tradeSoundC4, tradeSoundE4, tradeSoundF4, tradeSoundG4, tradeSoundB4, tradeSoundC5, tradeSoundE5, tradeSoundF5, tradeSoundF3, tradeSoundE3, tradeSoundC3, tradeSoundG3, tradeSoundB3 } from '../../Assets/AssetList';import { Synth } from 'tone/build/esm/instrument';
import { Sequence } from 'tone/build/esm/event';
import * as Tone from 'tone/build/esm';
import { EventBus } from '../EventBus';

export class AudioSequencer 
{
    private static _instance: AudioSequencer;
    sequences:Map<AudioEvent,AudioSequence> = new Map<AudioEvent,AudioSequence>();

    tempo : number = 120;
    currentSequence : AudioSequence;
    currentStep : number = 0;
    currentStepCount : number = 0;
    timePerClip : number

    private playbackTimeout: NodeJS.Timeout;

    private started : boolean = false;

    

    synth = new Synth().toDestination();

    upNotes : string[] = ["C4","E4","F4", "G4", "G4","B4", "C5", "E5", "F5"];

    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }

    private constructor()
    {
        //this.createSequences();

        EventBus.Instance.eventHandler.subscribe((p, r) => {
            if (r === 'BEGIN') {

                    this.started = true;
            }
        });
    }

    public init()
    {
       
        this.createSequences();
        Tone.Transport.start();
    }

    private createSequences()
    {
       //let bleepBf2Clip = new AudioClip(tradeSoundBf2);
       //let bleepC2Clip = new AudioClip(tradeSoundC2);
       //let bleepEf2Clip = new AudioClip(tradeSoundEf2);
       //let bleepE2Clip = new AudioClip(tradeSoundE2);
       //let bleepF2Clip = new AudioClip(tradeSoundF2);
       //let bleepG2Clip = new AudioClip(tradeSoundG2);
       //let bleepB2Clip = new AudioClip(tradeSoundB2);

       let bleepC3Clip = new AudioClip(tradeSoundC3);
       let bleepE3Clip = new AudioClip(tradeSoundE3);
       //let bleepEf3Clip = new AudioClip(bleepSoundEf3);
       let bleepF3Clip = new AudioClip(tradeSoundF3);
       let bleepG3Clip = new AudioClip(tradeSoundG3);
       let bleepB3Clip = new AudioClip(tradeSoundB3);
       let bleepC4Clip = new AudioClip(tradeSoundC4);
       let bleepE4Clip = new AudioClip(tradeSoundE4);
       let bleepF4Clip = new AudioClip(tradeSoundF4);
       let bleepG4Clip = new AudioClip(tradeSoundG4);
       let bleepB4Clip = new AudioClip(tradeSoundB4);
       let bleepC5Clip = new AudioClip(tradeSoundC5);
       let bleepE5Clip = new AudioClip(tradeSoundE5);
       let bleepF5Clip = new AudioClip(tradeSoundF5);

        let tradesUpArray = new Array<AudioClip>();
        tradesUpArray.push(bleepC4Clip);
        tradesUpArray.push(bleepE4Clip);
        tradesUpArray.push(bleepF4Clip);
        tradesUpArray.push(bleepG4Clip);
        tradesUpArray.push(bleepB4Clip);
        tradesUpArray.push(bleepC5Clip);
        tradesUpArray.push(bleepE5Clip);
        tradesUpArray.push(bleepF5Clip);

        let tradesUpSequence = new AudioSequence(BeatDivision.EIGHTH_NOTE,tradesUpArray);

        this.addAudioSequence(AudioEvent.TRADES_THROUGH_UP,tradesUpSequence);

        let tradesDownArray = new Array<AudioClip>();

        tradesDownArray.push(bleepF4Clip);
        tradesDownArray.push(bleepE4Clip);
        tradesDownArray.push(bleepC4Clip);
        tradesDownArray.push(bleepB3Clip);
        tradesDownArray.push(bleepG3Clip);
        tradesDownArray.push(bleepF3Clip);
        tradesDownArray.push(bleepE3Clip);
        tradesDownArray.push(bleepC3Clip);

        let tradesDownSequence = new AudioSequence(BeatDivision.EIGHTH_NOTE,tradesDownArray);

        this.addAudioSequence(AudioEvent.TRADES_THROUGH_DOWN,tradesDownSequence);
    
    }

    public addAudioSequence(event : AudioEvent, sequence : AudioSequence)
    {
        this.sequences.set(event,sequence);
    }

    public playSequence(audioEvent : AudioEvent, stepCount : number = 0)
    {
        
        if (this.started)
        {
            if (this.sequences.has(audioEvent))
            {
                let sequence : AudioSequence | undefined = this.sequences.get(audioEvent);
    
                if (sequence)
                {   
                    sequence.reset();
                    this.currentSequence = sequence;
                    this.currentStep = 0;
    
                    if (stepCount === 0)
                    {
                        this.currentStepCount = this.currentSequence.stepCount();
                    }
                    else
                    {
                        this.currentStepCount = Math.min(stepCount,this.currentSequence.stepCount());
                    }
    
                    this.startPlayback();
    
                }       
                
            }
    
        }
        
    }

    private startPlayback()
    {   
        if (this.currentSequence)
        {
            //Using Old Audio Player
            
            let timePerBeat : number = 60000/this.tempo;
            this.timePerClip = (timePerBeat / this.currentSequence.clipBeatDivision) * 0.001;

            //let synth = new Synth().toDestination();
            //let notes : string[] = this.upNotes.slice(0,this.currentStepCount);

            for (let i: number = 0; i < this.currentStepCount; i++)
            {
                let nextClip : AudioClip | undefined = this.currentSequence.getNextClip();

                if (nextClip)
                {   
                    //synth.triggerAttackRelease(notes[i], 0.0625, this.timePerClip * i);

                    nextClip.play(1.0);
                    this.currentStep++;
                    
                    //if (this.currentStep < this.currentStepCount)
                    //    this.playbackTimeout = setTimeout(this.playNextClip.bind(this), this.timePerClip, this) as NodeJS.Timeout;
                }


            }
            
            

            
            //Using Tone Library
            //let synth = new Synth().toDestination();
            /*
            const seq = new Sequence((time, note) => {
            synth.triggerAttackRelease(note, 0.0625, time);
	        // subdivisions are given as subarrays
            }, notes).start(0);
            */
           
            
        }
    }

    playNextClip()
    {
        let nextClip : AudioClip | undefined = this.currentSequence.getNextClip();

        if (nextClip)
        {
            nextClip.play();
            this.currentStep++;
            if (this.currentStep < this.currentStepCount)
                this.playbackTimeout = setTimeout(this.playNextClip.bind(this), this.timePerClip, this) as NodeJS.Timeout;  
        }
    } 
}
