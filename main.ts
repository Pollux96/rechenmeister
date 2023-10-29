function InitHw () {
    I2C_LCD1602.LcdInit(39)
    pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
}
function Start () {
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
    display(0, 0, "Hallo.")
    display(0, 1, "Rechenkuenstler.")
    display(0, 2, "ich starte.")
    basic.pause(2000)
    I2C_LCD1602.clear()
}
pins.onPulsed(DigitalPin.P1, PulseValue.Low, function () {
    control.waitMicros(114)
    basic.showIcon(IconNames.Meh)
    serial.writeLine("" + (pins.i2cReadNumber(33, NumberFormat.UInt8LE, false)))
})
pins.onPulsed(DigitalPin.P2, PulseValue.Low, function () {
    control.waitMicros(114)
    basic.showIcon(IconNames.Yes)
    serial.writeLine("" + (pins.i2cReadNumber(34, NumberFormat.UInt8LE, false)))
})
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
pins.onPulsed(DigitalPin.P0, PulseValue.Low, function () {
    control.waitMicros(114)
    basic.showIcon(IconNames.Heart)
    serial.writeLine("" + (pins.i2cReadNumber(32, NumberFormat.UInt8LE, false)))
})
let X = 0
let Y = 0
InitHw()
Start()
basic.forever(function () {
	
})
