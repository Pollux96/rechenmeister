function Start (Text: string, x: number, Y: number) {
    display(x, Y, Text)
}
function display (x: number, y: number, Text: string) {
    if (y == 2) {
        Y = 0
        X = x + 20
    } else if (y == 3) {
        Y = 1
        X = x + 20
    } else {
        Y = y
        X = x
    }
    I2C_LCD1602.ShowString(Text, X, Y)
}
let X = 0
let Y = 0
I2C_LCD1602.LcdInit(39)
Start("Hallo ich starte", 0, 0)
Start("rechenkuenstler", 0, 1)
basic.pause(1000)
basic.forever(function () {
	
})
