
//流程控制變數+偵錯變數
let start = 0
let SPflag = 0 
let BTflag = 0
let times = 0
let raw2 = ""
let value = 0

//加速度變數
let z = 0
let y = 0
let x = 0
let test = 0

// 按鈕事件偵測變數
let press = 1

// 運動動作ID
let ID = 100
let startDebugger = 0; //初次運動之偵錯

// 倒數計時相關變數
/*let countdownActive = false
let countdownStartTime = 0
let countdownDuration = 0
let lastDisplayedNumber = -1*/


//藍芽服務啟動
bluetooth.startUartService()
bluetooth.setTransmitPower(7)

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () { //藍芽資料接收
    let raw = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)).trim()
    value = parseInt(raw)
    // 檢查是否為有效的數字
    // else if (value == 0) {
    // BTflag = 0;
    // basic.showIcon(IconNames.Asleep)
    // }
    if (isNaN(value)) {
        // 顯示錯誤訊息
        serial.writeString(raw)
    } else {
        times = 0
        ID = value
        serial.writeValue("ID1", ID)
        if (ID >= 10) { //第二組(以上)運動
            if(ID == 60 || ID == 70){
                basic.showIcon(IconNames.Target)
            }
            else{
                BTflag = 0
                Countdown(ID)
            }  
        }
        else if (ID > 0 && startDebugger == 0){ //第一組運動
            if (ID == 6 || ID == 7) {
                startDebugger = 1;
                basic.showIcon(IconNames.Target)
            }
            else{
                startDebugger = 1;
                Countdown(ID)
            }
            
        }
        else if(ID == 0){  //結束運動
            BTflag = 0;
            basic.showIcon(IconNames.Happy)
            startDebugger = 0;
        }
    }
})

bluetooth.onBluetoothConnected(function () { //藍芽成功UI
    basic.pause(3000)
    basic.showIcon(IconNames.Yes)
})
bluetooth.onBluetoothDisconnected(function () { //藍芽停止連接
    BTflag = 0
})

// 按鈕偵測 暫時不用
input.onButtonPressed(Button.A, function () {
    // if (press == 1) {
    // BTflag == 1
    // press = 0;
    // status = "play"
    // }
    // else {
    // status = "pause"
    // press = 1;
    // //start = 0;
    // }
    times += 1
})
input.onButtonPressed(Button.B, function () {
    BTflag = 0
    times = 0
    bluetooth.uartWriteString("end")
})


let countdownActive = false
let countdownStart = 0
let countdownEnd = 0
let baseValue = 0

function Countdown(Countdown_id: number) { //UI倒數顯示
    pause(1000)
    if (countdownActive) return
    // 判斷倒數起點
    if (Countdown_id > 10) {
        ID = Countdown_id / 10
        serial.writeValue("ID2", ID)
        baseValue = 9
        CountingFunction.CountDown(baseValue)  
    } else if(startDebugger == 1){
        baseValue = 3
        CountingFunction.CountDown(baseValue)
    }
    else{
        start = 1
        BTflag = 1
    }

}


basic.forever(function () { //動作偵測
    pause(100)
    serial.writeValue("ID", ID)
    serial.writeValue("BTflag == 1", BTflag)
    if (BTflag == 1) {
            if (press == 1) {
                switch (ID) {
                    case 1: //手臂彎舉
                        Arm.Count_Curl(x, y, z);
                        break;
                    case 2: //肩推
                        Back.Count_ShoulderPress(x, y, z);
                        break;
                    case 3: //手臂伸展
                        Arm.Elbow_extension(x, y, z);
                        break;
                    case 4: //胸推
                        Back.Count_ChestPress(x, y, z);
                        break;
                    case 5: //划船
                        Back.Seated_row(x, y, z);
                        break;
                    default:
                        break;
                }
        basic.showNumber(times)
        bluetooth.uartWriteNumber(times)
    } 
    else if (press == 0) {
                basic.showString("P")
                bluetooth.uartWriteString("pause")
    }
        pause(100)
    }
})

function Acceleration() { //加速度偵測
    x = input.acceleration(Dimension.X)
    y = input.acceleration(Dimension.Y)
    z = input.acceleration(Dimension.Z)
    serial.writeValue("X", x)
    serial.writeValue("Y", y)
    serial.writeValue("Z", z)
    serial.writeValue("SPflag", SPflag)
    basic.pause(100)
}

basic.forever(function () { // 加速度偵測呼叫
    if (BTflag == 1) {
        Acceleration()
    }
})

