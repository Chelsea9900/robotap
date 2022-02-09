import { Object, Collider } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AudioManagerTS from './AudioManagerTS';
export default class GetCoinTS extends ZepetoScriptBehaviour {

    Start() {    

    }

    OnTriggerEnter(t: Collider){
        console.log(`CharacterControllerTS-OnTriggerEnter-BEFORE`);

        if(t.gameObject.tag == "Coin"){ //태그로 구별
            Object.Destroy(t.gameObject);
            AudioManagerTS.Instance.audioGetCoin();
        }else if(t.gameObject.name.includes(`Coin`)){ //이름으로 구별
            Object.Destroy(t.gameObject);
            AudioManagerTS.Instance.audioGetCoin();
            // this.GameOver();
        }

        console.log(`CharacterControllerTS-OnTriggerEnter-AFTER-${t.name}`);
        

    }

}