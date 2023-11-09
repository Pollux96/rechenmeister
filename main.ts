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
function PruefeEingabe () {
    AufgabeAusstehend = 0
    display(0, 3, "" + convertToText(einerWert + zehnerWert) + "in" + convertToText(control.millis() - Startzeit) + "ms")
}
function bestimmeZahlvonP2 (portWert: number) {
    if (255 - portWert == 1) {
        einerWert = 1
    } else if (255 - portWert == 2) {
        einerWert = 2
    } else if (255 - portWert == 4) {
        einerWert = 3
    } else if (255 - portWert == 8) {
        einerWert = 4
    } else if (255 - portWert == 16) {
        einerWert = 5
    } else if (255 - portWert == 32) {
        zehnerWert = 10
    } else if (255 - portWert == 64) {
        zehnerWert = 20
    } else if (255 - portWert == 128) {
        zehnerWert = 30
    } else {
        fehler = 1
    }
}
input.onButtonPressed(Button.AB, function () {
    TestGestartet = 1
    Startzeit = control.millis()
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
function InitSw () {
    Ergebnis = 0
    einerWert = 0
    zehnerWert = 0
    TestGestartet = 0
}
function bestimmeZahlvonP1 (portWert: number) {
    if (255 - portWert == 1) {
        zehnerWert = 40
    } else if (255 - portWert == 2) {
        zehnerWert = 50
    } else if (255 - portWert == 4) {
        zehnerWert = 90
    } else if (255 - portWert == 8) {
        zehnerWert = 100
    } else {
        fehler = 1
    }
}
function bestimmeZahlvonP0 (portWert: number) {
    if (255 - portWert == 1) {
        einerWert = 5
    } else if (255 - portWert == 2) {
        einerWert = 6
    } else if (255 - portWert == 4) {
        einerWert = 7
    } else if (255 - portWert == 8) {
        einerWert = 8
    } else if (255 - portWert == 16) {
        einerWert = 9
    } else if (255 - portWert == 32) {
        zehnerWert = 60
    } else if (255 - portWert == 64) {
        zehnerWert = 70
    } else if (255 - portWert == 128) {
        zehnerWert = 80
    } else {
        fehler = 1
    }
}
let P2 = 0
let P1 = 0
let P0 = 0
let Zahl1 = 0
let Ergebnis = 0
let X = 0
let Y = 0
let TestGestartet = 0
let fehler = 0
let Startzeit = 0
let zehnerWert = 0
let einerWert = 0
let AufgabeAusstehend = 0
InitHw()
InitSw()
basic.forever(function () {
    let Zahl2 = 0
    if (TestGestartet == 1 && AufgabeAusstehend == 0) {
        while (Zahl1 + Zahl2 > 100 || Zahl1 + Zahl2 == 0) {
            Zahl1 = randint(0, 100)
            Zahl1 = randint(0, 100)
        }
    }
    AufgabeAusstehend = 1
    display(0, 0, convertToText(Zahl1 + Zahl2))
})
basic.forever(function () {
    if (einerWert != 0 || zehnerWert != 0) {
        einerWert = 0
        zehnerWert = 0
    }
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P0) == 0) {
        control.waitMicros(40000)
        P0 = pins.i2cReadNumber(32, NumberFormat.UInt8LE, false)
        bestimmeZahlvonP0(P0)
    }
    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
        control.waitMicros(40000)
        P1 = pins.i2cReadNumber(33, NumberFormat.UInt8LE, false)
        bestimmeZahlvonP1(P1)
    }
    if (pins.digitalReadPin(DigitalPin.P2) == 0) {
        control.waitMicros(40000)
        P2 = pins.i2cReadNumber(34, NumberFormat.UInt8LE, false)
        bestimmeZahlvonP2(P2)
    }
})
