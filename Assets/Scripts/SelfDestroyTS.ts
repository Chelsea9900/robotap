import { GameObject, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class SelfDestroyTS extends ZepetoScriptBehaviour {

    Start() {    
        GameObject.Destroy(this.transform);
        Vector3.Slerp
    }

}