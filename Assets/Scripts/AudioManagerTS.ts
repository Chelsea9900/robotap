import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { AudioClip, AudioSource, GameObject } from 'UnityEngine'

export default class AudioManagerTS extends ZepetoScriptBehaviour {

    /** 싱글톤 */
    public static Instance: AudioManagerTS;
    public static GetInstance(): AudioManagerTS{
        if(!AudioManagerTS.Instance){
            var _obj = new GameObject(`CustomSingleton`);
            GameObject.DontDestroyOnLoad(_obj);
            AudioManagerTS.Instance = _obj.AddComponent<AudioManagerTS>();
        }
        return AudioManagerTS.Instance;
    }
    Awake(){
        AudioManagerTS.Instance = this;
    }

    private audioSource: AudioSource;

    // 에디터에서 mp3 파일을 연결해주면 됨
    public audioClipGetCoin: AudioClip;

    Start() {
        this.audioSource = this.gameObject.AddComponent<AudioSource>();
    }

    /** 코인을 먹었을 때 나는 효과음 */
    public audioGetCoin() {
        this.audioSource.clip = this.audioClipGetCoin;
        this.audioSource.loop = false;
        this.audioSource.Play();
        console.log(`AudioManagerTS-auduioGetCoin() is played`);
    }

}


