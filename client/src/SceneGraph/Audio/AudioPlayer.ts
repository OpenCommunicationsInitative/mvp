const reverbjs = {
    extend : (audioContext) => {
        const decodeBase64ToArrayBuffer = (input) => {
            const encodedValue = (input, index) => {
                let encodedCharacter;
                const x = input.charCodeAt(index);

                if (index < input.length) {
                    if (x >= 65 && x <= 90) {
                        encodedCharacter = x - 65;
                    } else if (x >= 97 && x <= 122) {
                        encodedCharacter = x - 71;
                    } else if (x >= 48 && x <= 57) {
                        encodedCharacter = x + 4;
                    } else if (x === 43) {
                        encodedCharacter = 62;
                    } else if (x === 47) {
                        encodedCharacter = 63;
                    } else if (x !== 61) {
                        console.log('base64 encountered unexpected character code: ' + x);
                    }
                }

                return encodedCharacter;
            }
    
            if (input.length === 0 || (input.length % 4) > 0) {
                console.log('base64 encountered unexpected length: ' + input.length);
                return;
            }
    
            const padding = input.match(/[=]*$/)[0].length;
            const decodedLength = input.length * 3 / 4 - padding;
            const buffer = new ArrayBuffer(decodedLength);
            const bufferView = new Uint8Array(buffer);
            const encoded : any = [];
            let d = 0;
            let e = 0;
            let i;
    
            while (d < decodedLength) {
                for (i = 0; i < 4; i += 1) {
                    encoded[i] = encodedValue(input, e);
                    e += 1;
                }
                bufferView[d] = (encoded[0] * 4) + Math.floor(encoded[1] / 16);
                d += 1;
                if (d < decodedLength) {
                    bufferView[d] = ((encoded[1] % 16) * 16) + Math.floor(encoded[2] / 4);
                    d += 1;
                }
                if (d < decodedLength) {
                    bufferView[d] = ((encoded[2] % 4) * 64) + encoded[3];
                    d += 1;
                }
            }

            return buffer;
        }
  
        const decodeAndSetupBuffer = (node, arrayBuffer, callback) => {
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            console.log('Finished decoding audio data.');
            node.buffer = audioBuffer;
            if (typeof callback === "function" && audioBuffer !== null) {
                callback(node);
            }
            }, (e) => {
                console.log('Could not decode audio data: ' + e);
            });
        }
  
        audioContext.createReverbFromBase64 = (audioBase64, callback) => {
            const reverbNode = audioContext.createConvolver();
            decodeAndSetupBuffer(reverbNode, decodeBase64ToArrayBuffer(audioBase64),
                callback);

            return reverbNode;
        };
    
        audioContext.createSourceFromBase64 = (audioBase64, callback) => {
            const sourceNode = audioContext.createBufferSource();
            decodeAndSetupBuffer(sourceNode, decodeBase64ToArrayBuffer(audioBase64),
                callback);

            return sourceNode;
        };
  
        audioContext.createReverbFromUrl = (audioUrl, callback) => {
            console.log('Downloading impulse response from ' + audioUrl);
            const reverbNode = audioContext.createConvolver();
            const request = new XMLHttpRequest();
            request.open('GET', audioUrl, true);

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    console.log('Downloaded impulse response');
                    decodeAndSetupBuffer(reverbNode, request.response, callback);
                }
            };

            request.onerror = (e) => {
                console.log('There was an error receiving the response: ');
                console.log(e);
                //reverbjs.networkError = e;
            };

            request.responseType = 'arraybuffer';
            request.send();

            return reverbNode;
        };
  
        audioContext.createSourceFromUrl = (audioUrl, callback) => {
            console.log('Downloading sound from ' + audioUrl);
            const sourceNode = audioContext.createBufferSource();
            const request = new XMLHttpRequest();
            request.open('GET', audioUrl, true);

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    console.log('Downloaded sound');
                    decodeAndSetupBuffer(sourceNode, request.response, callback);
                }
            };

            request.onerror = (e) => {
            console.log('There was an error receiving the response: ' + e);
            //reverbjs.networkError = e;
            };

            request.responseType = 'arraybuffer';
            request.send();
            return sourceNode;
        };
  
        audioContext.createReverbFromBase64Url = (audioUrl, callback) => {
            console.log('Downloading base64 impulse response from ' + audioUrl);
            const reverbNode = audioContext.createConvolver();
            const request = new XMLHttpRequest();
            request.open('GET', audioUrl, true);

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    console.log('Downloaded impulse response');
                    decodeAndSetupBuffer(reverbNode,
                        decodeBase64ToArrayBuffer(request.response),
                        callback);
                }
            };

            request.onerror = (e) => {
                console.log('There was an error receiving the response: ' + e);
                //reverbjs.networkError = e;
            };

            request.send();
            return reverbNode;
        };
  
        audioContext.createSourceFromBase64Url = (audioUrl, callback) => {
            console.log('Downloading base64 sound from ' + audioUrl);
            const sourceNode = audioContext.createBufferSource();
            const request = new XMLHttpRequest();
            request.open('GET', audioUrl, true);

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    console.log('Downloaded sound');
                    decodeAndSetupBuffer(sourceNode,
                    decodeBase64ToArrayBuffer(request.response),
                    callback);
                }
            };

            request.onerror = (e) => {
                console.log('There was an error receiving the response: ' + e);
                //reverbjs.networkError = e;
            };
            request.send();
            return sourceNode;
        };
    }
  };


export default class AudioPlayer {
    audioBuffer: any = null;
    context: any;
    URL: string;
    reverbUrl : string;
    reverbNode : any;

    constructor(URL: string) {
        this.URL = URL;
        const AudioContext: any = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        reverbjs.extend(this.context);
        //this.reverbNode = this.context.createReverbFromUrl(this.reverbUrl);

    }

    async loadAudioStream() {
        const request: XMLHttpRequest = new XMLHttpRequest();

        request.open("GET", this.URL, true);
        // Set the responseType to blob
        request.responseType = "arraybuffer";

        request.onload = () => {
            this.context?.decodeAudioData(request.response, 
                audioBuffer => {
                    this.audioBuffer = audioBuffer;
                },
                error =>
                    console.error(error)
            );
        }
        request.send();
    }

    async loadAudioStreamFromOnline() {
        window.fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/Yodel_Sound_Effect.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => this.context?.decodeAudioData(arrayBuffer,
            audioBuffer => {
                this.audioBuffer = audioBuffer;
            },
            error =>
                console.error(error)
        ));
    }

    resume() {
        this.context?.resume();
    }

    play(volume : number = 1.0, when : number = 0) {
        try {
            const source : AudioBufferSourceNode | undefined = this.context?.createBufferSource();

            if (source)
            {
                source.buffer = this.audioBuffer;

                if (this.context)
                {
                    //const reverbUrl = "http://reverbjs.org/Library/ElvedenHallMarbleHall.m4a";
                    //reverbjs.extend(this.context);
                    //const reverbNode = this.context.createReverbFromUrl(reverbUrl, () => {
                        const gainNode = this.context.createGain();
                        gainNode.gain.value = volume;
                        source.connect(gainNode);
                        //gainNode.connect(this.reverbNode);
                        //this.reverbNode.connect(this.context.destination);
                        source.connect(this.context.destination);
                        source.start(this.context.currentTime + when);
                   // });
                }
            }
        } catch (e) {
            alert(e);
        }
    }

    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
};
