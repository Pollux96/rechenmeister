function InitHw () {
    I2C_LCD1602.LcdInit(39)
    pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
}
function Start () {
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
    display(0, 0, "Hallo.")
    display(0, 1, "Rechenkuenstler.")
    display(0, 2, "ich starte.")
    I2C_LCD1602.clear()
    display(2, 2, "Drueke a.")
}
input.onButtonPressed(Button.A, function () {
    I2C_LCD1602.clear()
    display(0, 0, "die")
    display(0, 1, "rechenolympiade")
    display(0, 2, "startet")
})
pins.onPulsed(DigitalPin.P1, PulseValue.Low, function () {
    if (pins.pulseIn(DigitalPin.P1, PulseValue.High) > 50) {
        taste = pins.i2cReadNumber(33, NumberFormat.UInt8LE, false)
        if (taste < 255) {
            serial.writeNumber(taste)
            serial.writeLine("P1")
        }
    }
})
pins.onPulsed(DigitalPin.P2, PulseValue.Low, function () {
    if (pins.pulseIn(DigitalPin.P2, PulseValue.High) > 50) {
        taste = pins.i2cReadNumber(34, NumberFormat.UInt8LE, false)
        if (taste < 255) {
            serial.writeNumber(taste)
            serial.writeLine("P2")
        }
    }
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
    if (pins.pulseIn(DigitalPin.P0, PulseValue.High) > 50) {
        if (taste == 0) {
            taste = pins.i2cReadNumber(32, NumberFormat.UInt8LE, false)
        }
        if (taste < 255) {
            serial.writeNumber(taste)
            serial.writeLine("P0")
        }
    }
})
let X = 0
let Y = 0
let taste = 0
InitHw()
Start()
basic.forever(function () {
    if (taste != 0) {
        display(0, 0, convertToText(taste))
        taste = 0
    }
})
