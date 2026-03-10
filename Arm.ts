namespace Arm {
    export function Count_Curl(x: number, y: number, z: number) { //彎舉 id=1
        basic.pause(100)
        if (y >= 500) {
            times = times + 1
        }
    }

    export function Elbow_extension(x: number, y: number, z: number) { //手臂伸展 id=3
        //初始狀態
        if (y >= 200) {
            serial.writeValue("Test", 100)
            SPflag = 1;
        }
        else if (SPflag == 1) {
            if (y <= -750) {
                SPflag = 2;
                times = times + 1
            }
        }
        basic.pause(100)
    }
}