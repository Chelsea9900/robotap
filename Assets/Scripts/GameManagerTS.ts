/** 제페토 관련 임포트 */
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter, ZepetoCharacterCreator, ZepetoPlayer } from 'ZEPETO.Character.Controller'
import { WorldService } from 'ZEPETO.World';

/** 유니티 관련 임포트 */
import { Object, Vector3, WaitForSeconds, PlayerPrefs, Input, Camera, RaycastHit, Physics, CharacterController, GameObject, Collider, Random, KeyCode, Time, Space, Quaternion, Mathf, RectTransform, Vector2, RectTransformUtility } from 'UnityEngine';
import { Button, Image, InputField, Slider, Text } from 'UnityEngine.UI';

/** 스크립트 임포트 */
import GetCoinTS from './GetCoinTS';
import LineRayTS from './LineRayTS';
import { SceneManager } from 'UnityEngine.SceneManagement';

const rotationOption = {
        
};

export default class CharacterControllerTS extends ZepetoScriptBehaviour {

    @NonSerialized() public zepetoPlayer: ZepetoPlayer;
    @NonSerialized() public RandomCount: number;
    @NonSerialized() public RedLineSpeed: number = -30; // PC로 테스트할 때와 폰으로 테스트할 때 속도가 다르나, 폰끼리는 같습니다. 폰으로 할 때 -100 으로 하면 적당하지만, PC로 할 땐 -50 으로 해도 빠르고 -30이 적당..
    public RedLine: GameObject; // 막대
    public Shadow: GameObject; // 막대 히스토리
    @NonSerialized() public redLineEuler: Vector3; // 막대 히스토리를 기록할 때 사용되는 각도

    @NonSerialized() public easyModeRanNum: number;
    public textJudgeQuad: Text; // 어떤 것을 선택했는지 보여주는 Text UI
    public textEulerHistroyOfRedLine: Text; // 막대 히스토리의 오일러 각도를 보여주는 Text UI

    //new
    public yellowCircle: Image;
    public bonusCircle: Image;
    @NonSerialized() public myCurrentScore: number = 0;
    public textMyCurrentScore: Text;
    public textCurrentMode: Text;
    public textCurrentLevel: Text;

    @NonSerialized() public gameOn: bool;
    @NonSerialized() public middleBonus: bool;
    @NonSerialized() public currentMode: number = 0;
    @NonSerialized() public myCount: number = 0;
    public btnRestart: Button;
    public doll_HP_Slider: Slider;
    public textLevelPercent: Text;
    public imoticon: GameObject;
    @NonSerialized() public oneTime: bool = false;
    @NonSerialized() public currectOnTime: bool = false;
    @NonSerialized() public intervalLine: number = 0;
    public textBonusToast: Text;
    public rectScore: GameObject;

    // UI
    public fxParent: GameObject;
    public scoreFxUi: GameObject;
    public uiCam: Camera;

    /** CharacterControllerTS 싱글톤 */
    public static Instance: CharacterControllerTS;
    public static GetInstance(): CharacterControllerTS{
        if(!CharacterControllerTS.Instance){
            var _obj = new GameObject(`CharacterControllerTS`);
            GameObject.DontDestroyOnLoad(_obj);
            CharacterControllerTS.Instance = _obj.AddComponent<CharacterControllerTS>();
        }
        return CharacterControllerTS.Instance;
    }
    Awake(){
        CharacterControllerTS.Instance = this;
        this.gameOn = false;
    }

    Start() {
        this.SetCharacter();
        this.StartCoroutine(this.BeforeGameCoroutine());
        this.textMyCurrentScore.text = `My Current Score : 0`;
        this.doll_HP_Slider = this.doll_HP_Slider.GetComponent<Slider>();
        this.doll_HP_Slider.value = 0;

        this.btnRestart.onClick.AddListener(()=>{
            this.Restart();
        });

    }

    /** 로컬 플레이어 캐릭터를 생성합니다. */
    SetCharacter(){
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, WorldService.userId, new SpawnInfo(), false);
        ZepetoPlayers.instance.OnAddedPlayer.AddListener(()=>{ 
            this.zepetoPlayer = ZepetoPlayers.instance.GetPlayer(WorldService.userId);
            this.zepetoPlayer.character.gameObject.AddComponent<GetCoinTS>();
            GameObject.Find("ZepetoCamera").transform.gameObject.SetActive(false);
            // GameObject.Find(`UIZepetoPlayerControl`).transform.gameObject.SetActive(false);
            // let _player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
            // _player.gameObject.AddComponent<GetCoinTS>();
            // ZepetoPlayers.instance.gameObject.AddComponent<GetCoinTS>();

            // _player.gameObject.AddComponent<GetCoinTS>();
            // const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
            // myPlayer.character.gameObject.AddComponent<tsCharacterCollision>();
        });
    }
        
   
    Update(){

        // if((this.RedLine.activeSelf === true) && (this.Shadow.activeSelf === true)) {
        //     let checkInterval = Math.abs(this.redLineEuler.z - this.Shadow.transform.rotation.eulerAngles.z);
        //     if( (checkInterval < 0.01) || (checkInterval > 359.99) && (checkInterval > 0) ) {
        //         if (this.currectOnTime === false) {
        //             this.oneTime = true;
        //             console.log(`checkInterval: ${checkInterval}`);
        //         }
        //     } 
        // }

        // // 이걸 다듬으면 될 것 같음..! 오일러 말고 로테이션이 맞는 듯 //NEW
        // if((this.RedLine.activeSelf === true) && (this.Shadow.activeSelf === true)) {
        //     let checkInterval =  Math.abs( Mathf.DeltaAngle(Math.abs(this.RedLine.transform.rotation.z), Math.abs(this.Shadow.transform.rotation.z)));
            
        //     this.intervalLine += checkInterval;
        //     //console.log(`checkInterval: ${checkInterval}`);
        //     console.log(`intervalLine: ${this.intervalLine}`);

        //     if( this.intervalLine > 355 && this.intervalLine < 365 ) {
        //             this.oneTime = true;
        //             console.log(`intervalLine: ${this.intervalLine}`);
        //     } 
        // }

        // if( (this.RedLine.activeSelf === true) && (this.Shadow.activeSelf === true) ) {
        //     let nowInterval = Math.abs( Mathf.DeltaAngle( this.RedLine.transform.rotation.eulerAngles.z , this.Shadow.transform.rotation.eulerAngles.z ) );
        //     if( (nowInterval / 36) === 0) {
        //         nowInterval += 36;
        //         console.log(`nowInterval: ${nowInterval}`);
        //     }
        //     if(nowInterval >= 360){
        //         console.log(`LOOOOOOSE`);
        //         this.oneTime = true;
        //     }
        // }

        // 테스트용
        if(this.myCount == 5){
            // this.resetLines();
            // this.RedLineSpeed = -30; 
            this.StartCoroutine(this.MiddleModeCoroutine());
        } else if(this.myCount == 10){
            // this.resetLines();
            // this.RedLineSpeed = -50;
            this.StartCoroutine(this.HighModeCoroutine());
        }

        if(this.gameOn) { 
            this.resetLines();
        }

        this.redLineEuler = this.RedLine.transform.rotation.eulerAngles; // 빨간 막대 오일러 각
        this.textJudgeQuad.text = `Current RedLine's Euler : (${this.RedLine.transform.rotation.eulerAngles.x}, ${this.RedLine.transform.rotation.eulerAngles.y}, ${ Math.floor(this.RedLine.transform.rotation.eulerAngles.z)})`;

        // Update() 에서 화면의 아무 곳이나 터치할 때 마다 아래의 작업을 수행합니다.
        if(Input.GetMouseButtonDown(0)){
            
            switch(this.currentMode){
                case 0:
                    this.EasyMode();
                    break;

                case 1:
                    this.MiddleMode();
                    break;

                case 2:
                    this.HighMode();
                    break;
            }

            if(this.gameOn) { 
                this.myCount ++;
                this.doll_HP_Slider.value ++;
                this.textCurrentLevel.text = `Level: ${this.myCount}`;
                this.textLevelPercent.text = `${this.doll_HP_Slider.value / this.doll_HP_Slider.maxValue * 100} %`;
                console.log(`myCount: ${this.myCount}`);

                if(this.doll_HP_Slider.value === this.doll_HP_Slider.maxValue){
                    this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(true); // 무표정
                    this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(false); // 슬픈 표정
                    // this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(true); // 웃는 표정
                }

            } else { 
                this.textCurrentLevel.text = `Level: ${this.myCount}`;
                console.log(`myCount: ${this.myCount}`);

                this.btnRestart.gameObject.SetActive(true);

                this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(false); // 무표정
                this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(true); // 슬픈 표정
                this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정
            }
        }

        if(this.oneTime){ // 한 바퀴 지나서도 터치 안하면 게임 종료
            this.textMyCurrentScore.text = `LOOOOOSE`;
            this.gameOn = false;
            this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(false); // 무표정
            this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(true); // 슬픈 표정
            // this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(true); // 웃는 표정
            this.btnRestart.gameObject.SetActive(true);
        }

    }

    * BeforeGameCoroutine(){
        // 3초 대기
        yield new WaitForSeconds(3);

        yield this.StartCoroutine(this.EasyModeCoroutine());
    }

    * EasyModeCoroutine(){
        this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(true); // 무표정
        this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(false); // 슬픈 표정
        // this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정      

        this.currentMode = 0;
        this.doll_HP_Slider.value = 0;
        this.textCurrentMode.text = `Mode: Easy`;

        this.resetYellowCircle();

        this.gameOn = true;

        // yield this.StartCoroutine(this.MiddleModeCoroutine());
    }

    * MiddleModeCoroutine(){
        // yield new WaitForSeconds(3);
        // this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(true); // 무표정
        // this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(false); // 슬픈 표정
        // this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정

        this.currentMode = 1;
        this.doll_HP_Slider.value = 0;
        this.textCurrentMode.text = `Mode: Middle`;

        this.resetYellowCircle();
        this.resetMiddleBonus();
        // yield this.StartCoroutine(this.HighModeCoroutine());
        // this.RedLineSpeed = this.RedLineSpeed - 10; // 이건 아님..
    }

    * HighModeCoroutine(){
        // yield new WaitForSeconds(3);
        // this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(true); // 무표정
        // this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(false); // 슬픈 표정
        // this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정

        this.currentMode = 2;
        this.doll_HP_Slider.value = 0;
        this.textCurrentMode.text = `Mode: High`;

        this.resetYellowCircle();
        this.resetHighBonus();
        // this.RedLineSpeed = this.RedLineSpeed - 10; // 이건 아님..

    }

    public resetYellowCircle(){ // 초급모드, 중급모드, 고급모드 모두에서 쓰임
        this.yellowCircle.gameObject.SetActive(true);
        this.yellowCircle.gameObject.transform.rotation = Quaternion.Euler(0,0,125);
        this.yellowCircle.GetComponent<Image>().fillAmount = 0.3;
    }

    public RandomMargin(): number{
        return this.RandomCount = Math.floor(Random.Range(80, 120));  
    }

    public RandomDrawYellow(): number{
        return this.RandomCount = Math.floor(Random.Range(1.8, 4));  
    }

    public resetMiddleBonus(){ // 중급모드에서만 쓰임
        this.bonusCircle.gameObject.SetActive(true);
        this.bonusCircle.gameObject.transform.rotation = Quaternion.Euler(0,0, 360 * this.yellowCircle.GetComponent<Image>().fillAmount * 0.4 + 125);
        this.bonusCircle.GetComponent<Image>().fillAmount = this.yellowCircle.GetComponent<Image>().fillAmount * 0.2;
    }

    public resetHighBonus(){ // 고급모드에서만 쓰임
        this.bonusCircle.gameObject.SetActive(true);
        // this.bonusCircle.gameObject.transform.rotation = Quaternion.Euler(0,0,125);

        // let RandomHighMode = Math.floor(Random.Range(0, 2));  
        let RandomHighMode = 0;  

        if (RandomHighMode == 0){ // 보너스가 왼쪽에서 생김
            this.bonusCircle.gameObject.transform.rotation = Quaternion.Euler(0,0,125);
        } else if(RandomHighMode == 1){ // 보너스가 오른쪽에서 생김
            this.bonusCircle.gameObject.transform.rotation = Quaternion.Euler(0,0, 360 * this.yellowCircle.GetComponent<Image>().fillAmount * 0.8 + 125);
        }
        this.bonusCircle.GetComponent<Image>().fillAmount = this.yellowCircle.GetComponent<Image>().fillAmount * 0.2;
    }

    public EasyMode(){

        // 막대의 그림자를 남기기
        this.Shadow.transform.rotation = Quaternion.Euler(this.RedLine.transform.rotation.eulerAngles); // 빨간 막대의 오일러 각에 맞춰서 그림자를 회전시키기
        this.textEulerHistroyOfRedLine.text = `History Of RedLine's Euler : (${ this.Shadow.transform.rotation.eulerAngles.x}, ${this.Shadow.transform.rotation.eulerAngles.y}, ${ Math.floor(this.Shadow.transform.rotation.eulerAngles.z) })`;
 
        // 1. 점수 판단
        let area1 = this.yellowCircle.transform.rotation.eulerAngles.z
        if (area1 >= 360)
            area1-= 360;

        let yellowFillAmount = 360 * this.yellowCircle.GetComponent<Image>().fillAmount;
        let area2 = yellowFillAmount + this.yellowCircle.transform.rotation.eulerAngles.z ;
        if(area2 >= 360)
            area2 -= 360;

        // 1-1. YellowImage에 맞게 터치했다면
        if((this.redLineEuler.z >= area1 && this.redLineEuler.z <= area2) || (area1 > area2 && (this.redLineEuler.z > area1 || this.redLineEuler.z < area2))) {
            // this.currectOnTime = true;

            this.myCurrentScore += 10;
            this.textMyCurrentScore.text = `My Current Score : ${this.myCurrentScore}`;

            // YellowImage 범위를 변경해주기 (최소 0.25 ~ 최대 0.33)
            this.yellowCircle.GetComponent<Image>().fillAmount = this.RandomDrawYellow() * 0.11; // 랜덤으로 노란색 채우기 // 추후에 수 조절할 예정

            this.yellowCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.redLineEuler , new Vector3(0,0,this.RandomMargin()))); // 일정 영역 이외에서 랜덤 회전

            // 막대의 회전 방향을 반대로 바꾸기
            this.RedLineSpeed = this.RedLineSpeed * -1;

            this.ActiveHitFx(0); //NEW

        }  else { // 1-2. YellowImage 이외의 영역을 터치했다면
            this.myCurrentScore = 0;
            this.textMyCurrentScore.text = `LOSE`;

            // 게임 멈춤
            this.gameOn = false;
            this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(false); // 무표정
            this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(true); // 슬픈 표정
            this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정

            this.btnRestart.gameObject.SetActive(true);
        }
        // console.log(`1: ${this.redLineEuler.z}, 2: ${area1}, 3: ${area2}`);
        // this.currectOnTime = false; //Q.. 한 텀은 그렇다 치고,, 한 탭 끼리는 어쩔 것..?

    }

    public MiddleMode(){
        // 1. 점수 판단
        let area1 = this.yellowCircle.transform.rotation.eulerAngles.z
        if (area1 >= 360)
            area1-= 360;

        let yellowFillAmount = 360 * this.yellowCircle.GetComponent<Image>().fillAmount;
        let area2 = yellowFillAmount + this.yellowCircle.transform.rotation.eulerAngles.z ;
        if(area2 >= 360)
            area2 -= 360;

        // 보너스 점수 판단
        let middle1 = this.bonusCircle.transform.rotation.eulerAngles.z
        if (middle1 >= 360)
            middle1-= 360;

        let bonusFillAmount = 360 * this.bonusCircle.GetComponent<Image>().fillAmount;
        let middle2 = bonusFillAmount + this.bonusCircle.transform.rotation.eulerAngles.z ;
        if(middle2 >= 360)
            middle2 -= 360;

        // 1-1. YellowImage에 맞게 터치했다면
        if((this.redLineEuler.z >= area1 && this.redLineEuler.z <= area2) || (area1 > area2 && (this.redLineEuler.z > area1 || this.redLineEuler.z < area2))) {
            this.myCurrentScore += 10;
            this.textMyCurrentScore.text = `My Current Score : ${this.myCurrentScore}`;
            this.ActiveHitFx(0); //NEW

            if((this.redLineEuler.z >= middle1 && this.redLineEuler.z <= middle2) || (middle1 > middle2 && (this.redLineEuler.z > middle1 || this.redLineEuler.z < middle2))) {
                this.myCurrentScore += 15;
                this.textMyCurrentScore.text = `My Current Score : ${this.myCurrentScore}`;
                // this.textBonusToast.gameObject.SetActive(true);
                // this.textBonusToast.text = `Middle Bonus : 15`;
                this.ActiveHitFx(1); //NEW
            } //NEW

            // YellowImage 범위를 변경해주기 (최소 0.25 ~ 최대 0.33)
            this.yellowCircle.GetComponent<Image>().fillAmount = this.RandomDrawYellow() * 0.11; // 랜덤으로 노란색 채우기 // 추후에 수 조절할 예정
            this.bonusCircle.GetComponent<Image>().fillAmount = this.yellowCircle.GetComponent<Image>().fillAmount * 0.2; // 보너스 영역은 노란 영역의 20% 입니다.

            let middleRandomMargin = this.RandomMargin()
            this.yellowCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.redLineEuler , new Vector3(0,0,middleRandomMargin))); // 일정 영역 이외에서 랜덤 회전
            this.bonusCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.redLineEuler , new Vector3(0,0,middleRandomMargin))); // 일정 영역 이외에서 랜덤 회전
            this.bonusCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.bonusCircle.transform.rotation.eulerAngles , new Vector3(0,0,360 * this.yellowCircle.GetComponent<Image>().fillAmount * 0.4))); // 노랑영역의 중앙으로 이동
            
  
        } else { // 1-2. YellowImage 이외의 영역을 터치했다면
            this.myCurrentScore = 0;
            this.textMyCurrentScore.text = `LOSE`;

            // 게임 멈춤
            this.gameOn = false; 
            this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(false); // 무표정
            this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(true); // 슬픈 표정
            this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정
            this.btnRestart.gameObject.SetActive(true);

        }

        // 2. 막대의 회전 방향을 반대로 바꾸기
        this.RedLineSpeed = this.RedLineSpeed * -1;

        // 3. 막대의 그림자를 남기기
        this.Shadow.transform.rotation = Quaternion.Euler(this.RedLine.transform.rotation.eulerAngles); // 빨간 막대의 오일러 각에 맞춰서 그림자를 회전시키기
        this.textEulerHistroyOfRedLine.text = `History Of RedLine's Euler : (${ this.Shadow.transform.rotation.eulerAngles.x}, ${this.Shadow.transform.rotation.eulerAngles.y}, ${ Math.floor(this.Shadow.transform.rotation.eulerAngles.z) })`;

    }

    public HighMode(){

        // 1. 점수 판단
        let area1 = this.yellowCircle.transform.rotation.eulerAngles.z
        if (area1 >= 360)
            area1-= 360;
 
        let yellowFillAmount = 360 * this.yellowCircle.GetComponent<Image>().fillAmount;
        let area2 = yellowFillAmount + this.yellowCircle.transform.rotation.eulerAngles.z ;
        if(area2 >= 360)
            area2 -= 360;
 
        // 보너스 점수 판단
        let high1 = this.bonusCircle.transform.rotation.eulerAngles.z
        if (high1 >= 360)
            high1-= 360;

        let bonusFillAmount = 360 * this.bonusCircle.GetComponent<Image>().fillAmount;
        let high2 = bonusFillAmount + this.bonusCircle.transform.rotation.eulerAngles.z ;
        if(high2 >= 360)
            high2 -= 360;

        // 1-1. YellowImage에 맞게 터치했다면
        if((this.redLineEuler.z >= area1 && this.redLineEuler.z <= area2) || (area1 > area2 && (this.redLineEuler.z > area1 || this.redLineEuler.z < area2))) {
            this.myCurrentScore += 10;
            this.textMyCurrentScore.text = `My Current Score : ${this.myCurrentScore}`;
            this.ActiveHitFx(0); //NEW

            if((this.redLineEuler.z >= high1 && this.redLineEuler.z <= high2) || (high1 > high2 && (this.redLineEuler.z > high1 || this.redLineEuler.z < high2))) {
                this.myCurrentScore += 20;
                this.ActiveHitFx(2); //NEW
                // this.textMyCurrentScore.text = `My Current Score : ${this.myCurrentScore}`;
                // this.textBonusToast.text = `High Bonus : 20`;
        } 
 
        // YellowImage 범위를 변경해주기 (최소 0.25 ~ 최대 0.33)
        this.yellowCircle.GetComponent<Image>().fillAmount = this.RandomDrawYellow() * 0.11; // 랜덤으로 노란색 채우기 // 추후에 수 조절할 예정
        this.bonusCircle.GetComponent<Image>().fillAmount = this.yellowCircle.GetComponent<Image>().fillAmount * 0.2; // 보너스 영역은 노란 영역의 20% 입니다.

        let middleRandomMargin = this.RandomMargin()
        this.yellowCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.redLineEuler , new Vector3(0,0,middleRandomMargin))); // 일정 영역 이외에서 랜덤 회전

        let RandomHighMode = Math.floor(Random.Range(0, 2));  

        if(RandomHighMode == 0){
            this.bonusCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.redLineEuler , new Vector3(0,0,middleRandomMargin))); // 노랑영역의 끝으로 이동

        } else if(RandomHighMode == 1){
            this.bonusCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.redLineEuler , new Vector3(0,0,middleRandomMargin))); // 일정 영역 이외에서 랜덤 회전
            this.bonusCircle.transform.rotation = Quaternion.Euler( Vector3.op_Addition( this.bonusCircle.transform.rotation.eulerAngles , new Vector3(0,0,360 * this.yellowCircle.GetComponent<Image>().fillAmount * 0.8))); // 노랑영역의 끝으로 이동
        }

    }  else { // 1-2. YellowImage 이외의 영역을 터치했다면
        this.myCurrentScore = 0;
        this.textMyCurrentScore.text = `LOSE`;

        // 게임 멈춤
        this.gameOn = false; 
        this.imoticon.gameObject.transform.GetChild(0).gameObject.SetActive(false); // 무표정
        this.imoticon.gameObject.transform.GetChild(1).gameObject.SetActive(true); // 슬픈 표정
        this.imoticon.gameObject.transform.GetChild(2).gameObject.SetActive(false); // 웃는 표정
        this.btnRestart.gameObject.SetActive(true);

    }

        // 2. 막대의 회전 방향을 반대로 바꾸기
        this.RedLineSpeed = this.RedLineSpeed * -1;

        // 3. 막대의 그림자를 남기기
        this.Shadow.transform.rotation = Quaternion.Euler(this.RedLine.transform.rotation.eulerAngles); // 빨간 막대의 오일러 각에 맞춰서 그림자를 회전시키기
        this.textEulerHistroyOfRedLine.text = `History Of RedLine's Euler : (${ this.Shadow.transform.rotation.eulerAngles.x}, ${this.Shadow.transform.rotation.eulerAngles.y}, ${ Math.floor(this.Shadow.transform.rotation.eulerAngles.z) })`;
    }


    Restart(){
        SceneManager.LoadScene(this.gameObject.scene.name);
    }

    resetLines(){
        CharacterControllerTS.Instance.RedLine.gameObject.SetActive(true); // 막대 회전 시작
        CharacterControllerTS.Instance.Shadow.gameObject.SetActive(true); // 막대 히스토리 시작
        CharacterControllerTS.Instance.RedLine.gameObject.transform.Rotate(Vector3.op_Multiply(new Vector3(0,0,this.RedLineSpeed), Time.fixedDeltaTime));      
        CharacterControllerTS.Instance.Shadow.gameObject.transform.Rotate(0,0,0);
    }

    ActiveHitFx(mode: number) {
        let fx: GameObject = GameObject.Instantiate(this.scoreFxUi, this.fxParent.transform) as GameObject;

        switch(mode){
            case 0: // 10
                fx.gameObject.transform.GetChild(0).gameObject.SetActive(true); //10
                fx.gameObject.transform.GetChild(1).gameObject.SetActive(false); //15
                fx.gameObject.transform.GetChild(2).gameObject.SetActive(false); //20
                break;
            
            case 1: // 15
                fx.gameObject.transform.GetChild(0).gameObject.SetActive(false);
                fx.gameObject.transform.GetChild(1).gameObject.SetActive(true);
                fx.gameObject.transform.GetChild(2).gameObject.SetActive(false);
                break;    

            case 2: // 20
                fx.gameObject.transform.GetChild(0).gameObject.SetActive(false);
                fx.gameObject.transform.GetChild(1).gameObject.SetActive(false);
                fx.gameObject.transform.GetChild(2).gameObject.SetActive(true);
                break;
        }
        // fx.GetComponent<RectTransform>().anchoredPosition = this.GetRectPos(position, this.fxParent.GetComponent<RectTransform>());
        GameObject.Destroy(fx,0.7);
    }
    // GetRectPos(pos: Vector3, parentRect: RectTransform): Vector2 {
    //     let fxPos: $Ref<Vector2> = $ref<Vector2>();
    //     let ScreenPosition: Vector3 = Camera.main.WorldToScreenPoint(pos);
    //     RectTransformUtility.ScreenPointToLocalPointInRectangle(parentRect, new Vector2(ScreenPosition.x, ScreenPosition.y), CharacterControllerTS.Instance.uiCam, fxPos);
    //     return new Vector2($unref(fxPos)[0], $unref(fxPos)[1]);
    // }
}
