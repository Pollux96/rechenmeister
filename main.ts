function macheEtwas (x: number, y: number, Text: string) {
    if (y == 2) {
        Y = 0
        X = x + 20
    } else if (false) {
    	
    } else {
    	
    }
    I2C_LCD1602.ShowString(Text, X, Y)
}
let X = 0
let Y = 0
I2C_LCD1602.LcdInit(39)
macheEtwas(0, 0, "abc")
macheEtwas(0, 1, "abc")
macheEtwas(0, 2, "abc")
macheEtwas(0, 3, "abc")
basic.forever(function () {
	
})
