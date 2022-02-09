import { Color, Material, MeshRenderer, Quaternion, Random, Time, Transform, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class EnemyControllerTS extends ZepetoScriptBehaviour {

    
    @NonSerialized() public RandomCount: number;
    @NonSerialized() public m_Time: number = 0;
    @NonSerialized() private new_p;
    @NonSerialized() private zepeto: Transform;

    Start() {

        this.gameObject.GetComponent<MeshRenderer>().material.color = Color.green;
        console.log(`매터리얼 흰색에서 초록으로 변경`);

        this.StartCoroutine(this.SomeCoroutine());
        // this.StartCoroutine(this.TimeCoroutine());
    }

    * SomeCoroutine(){
        yield new WaitForSeconds(5);
        // console.log(`시작하고 5초가 지났음`);
        
        // transform.rotation은 월드 기준으로 회전을 하고, 
        // transform.rotate()은 로컬(오브젝트) 기준으로 회전합니다. 

        this.transform.Rotate(new Vector3(0,1,0));
        
        this.transform.Rotate(0, 150, 0);
        console.log(`150도 회전함`);
        
        // this.transform.Rotate(Vector3.up * 30);
        // this.transform.Rotate(0, 180*Time.deltaTime, 0); // 천천히 회전시키고 싶었는데 왜 안되징..
        // this.transform.rotation = Quaternion.Lerp(this.transform.rotation, Quaternion.LookRotation(Vector3.forward), Time.deltaTime * 10);
        // this.transform.rotation = Quaternion.Slerp(this.transform.rotation, 180)

        this.gameObject.GetComponent<MeshRenderer>().material.color = Color.red;
        console.log(`매터리얼 빨간색으로 변경`);

        console.log(`랜덤 숫자 : ${this.RandomNum()}`); 

        // yield this.StartCoroutine(this.TimeCoroutine());
    }

    /** 
        1~4 의 정수를 랜덤하게 뽑아주는 함수.
        (용도 1: 몇 초 동안 검사 안할건지?,
        용도 2: 몇 초 동안 검사할건지?)
    */
    public RandomNum(): number{
        return this.RandomCount = Math.floor(Random.Range(1, 5));  
    }

    /** 
        시작하고 몇 초가 흘렀는지 알 수 있는 코루틴.
    */
    * TimeCoroutine(){  
        while(true){
            yield new WaitForSeconds(1);
            this.m_Time++;
            console.log(`this.m_Time : ${this.m_Time}`);
        }
    }

    Update(){
        // this.new_p = Vector3.Lerp(this.transform.position, Vector3.op_Subtraction())
    }

    *SecondCoroutine(){
        while(true){
            yield this.StartCoroutine(this.TimeCoroutine);
            this.m_Time++;
            console.log(`${this.m_Time}`);
        }
    }

    CheckPlayerDistance(){
        let d = Vector3.Distance(this.transform.position, this.zepeto.position);
        if(d>5){
            
        }else{
            //
        }
    }



    

}

