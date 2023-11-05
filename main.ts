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
    control.waitMicros(1000)
    taste = 255 - pins.i2cReadNumber(33, NumberFormat.UInt8LE, false)
    if (taste > 0) {
        serial.writeLine("P1")
        serial.writeNumber(taste)
    }
})
pins.onPulsed(DigitalPin.P2, PulseValue.Low, function () {
    control.waitMicros(1000)
    taste = 255 - pins.i2cReadNumber(34, NumberFormat.UInt8LE, false)
    if (taste > 0) {
        serial.writeLine("P2")
        serial.writeNumber(taste)
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
control.onEvent(EventBusSource.MICROBIT_ID_IO_P0, EventBusValue.MICROBIT_PIN_EVT_FALL, function () {
    control.waitMicros(1200)
    serial.writeLine("Ereignis P0")
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        taste = 255 - pins.i2cReadNumber(32, NumberFormat.UInt8LE, false)
        serial.writeLine("Lese P0")
    }
    if (taste > 0) {
        serial.writeLine("P0")
        serial.writeNumber(taste)
    }
})
let X = 0
let Y = 0
let taste = 0
InitHw()
Start()
