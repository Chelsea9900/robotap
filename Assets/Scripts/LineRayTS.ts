import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Vector3, Input, Camera, RaycastHit, Physics, GameObject, Collider, Random, RaycastHit2D, Physics2D, KeyCode, Debug, Color, MeshRenderer, Canvas, TouchPhase, LayerMask } from 'UnityEngine';
import { Button, Text, Image, GraphicRaycaster } from 'UnityEngine.UI';
import 'UnityEngine.EventSystems'; 
import { EventSystem, PointerEventData, RaycastResult } from 'UnityEngine.EventSystems';
import { List$1 } from 'System.Collections.Generic';
import { UnityAction } from 'UnityEngine.Events';

export default class LineRayTS extends ZepetoScriptBehaviour {

    /** LineRayTS 싱글톤 */
    public static Instance: LineRayTS;
    public static GetInstance(): LineRayTS{
        if(!LineRayTS.Instance){
            var _obj = new GameObject(`LineRayTS`);
            GameObject.DontDestroyOnLoad(_obj);
            LineRayTS.Instance = _obj.AddComponent<LineRayTS>();
        }
        return LineRayTS.Instance;
    }
    Awake(){
        LineRayTS.Instance = this;
    }
    
    Start(){    
    }

    /** 
        방법 1 을 활용해서 점수 판단을 하는 함수 JudgeScore() 입니다. 

        * 방법 1. 화면의 아무 곳을 터치하면 SpriteRedLine (빨간 막대) 에서 Ray 를 쏘고, 
        hitInfo 에서 Quad의 정보를 얻어옵니다. Ray를 쏘는 GameObject (LineRayTS 스크립트의 주인) 는 'spriteRedLine' 입니다.
    */
    public JudgeScore(): string{
        // Debug.DrawRay(this.transform.position, Vector3.forward, Color.red);
        let hitInfo = $ref<RaycastHit>();

        if(Physics.Raycast(this.transform.position, this.transform.forward, hitInfo)){
            // console.log(`JudgeScore() is called to cast Ray.`);
            let myhitInfo = $unref(hitInfo);
            let selectedQuad : string = myhitInfo.transform.name;

            // console.log(`Ray at : ${selectedQuad}`); 
            return selectedQuad;

            /*
                아래 3개는 모두 똑같습니다.
                console.log(`sprite: ${myhitInfo.collider.name}`);
                console.log(`sprite: ${myhitInfo.transform.name}`); 
                console.log(`sprite: ${myhitInfo.collider.gameObject.name}`);
            */
            
        }else{
            console.log(`Nothing is detected.`); 
        }

    }



}