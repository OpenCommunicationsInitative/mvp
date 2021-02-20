import * as Tone from 'tone/build/esm';

export class AudioClip 
{
  public player : Tone.Player;

    constructor(url : string )
    {
      this.loadAudio(url);
    }

    private async loadAudio(url)
    {
        if (!this.player)
        {
          this.player = new Tone.Player(url).toDestination();
          //await this.player.loadAudioStream();
        }
    }
          
    public play(when : number = 0)
    {
        if (this.player)
          this.player.start(Tone.now()+when);
    }
}
