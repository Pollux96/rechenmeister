function InitHw () {
    I2C_LCD1602.LcdInit(39)
    pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
}
function leseTasten () {
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
}
input.onButtonPressed(Button.A, function () {
    TestGestartet = 1
})
function PruefeEingabe () {
    if (AufgabeAusstehend == 1) {
        leseTasten()
        if (Ergebnis > 10) {
            if (einerWert != 0 && zehnerWert != 0) {
                Endzeit = control.millis() - Startzeit
                EingabeBeendet = 1
            }
        } else if (einerWert != 0) {
            Endzeit = control.millis() - Startzeit
            EingabeBeendet = 1
        }
        if (EingabeBeendet) {
            if (einerWert + zehnerWert == Ergebnis) {
                basic.showIcon(IconNames.Yes)
            } else {
                basic.showIcon(IconNames.No)
            }
            display(14, 1, convertToText(Ergebnis))
            display(0, 2, "" + convertToText(Endzeit) + "ms")
            basic.pause(2000)
            I2C_LCD1602.clear()
            AufgabeAusstehend = 0
            einerWert = 0
            zehnerWert = 0
            Zahl1 = 0
            Zahl2 = 0
            EingabeBeendet = 0
            Zustand = 2
        }
    }
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
    ZeigeAufgabe = 0
    EingabeBeendet = 0
    Zustand = 0
}
function bestimmeZahlvonP1 (portWert2: number) {
    if (255 - portWert2 == 1) {
        zehnerWert = 40
    } else if (255 - portWert2 == 2) {
        zehnerWert = 50
    } else if (255 - portWert2 == 4) {
        zehnerWert = 90
    } else if (255 - portWert2 == 8) {
        zehnerWert = 100
    } else {
        fehler = 1
    }
}
function Menu () {
    I2C_LCD1602.clear()
    display(0, 0, "SCHWARZE KNOEPFE")
    basic.pause(2000)
    I2C_LCD1602.clear()
    display(0, 0, "1 Plus & Minus")
    display(0, 1, "2 Plus")
    display(0, 2, "3 Minus")
    while (einerWert == 0) {
        leseTasten()
    }
    RechenModus = einerWert
    einerWert = 0
    if (RechenModus == 2) {
        Operation = 1
    } else if (RechenModus == 3) {
        Operation = 2
    }
    I2C_LCD1602.clear()
    display(0, 1, "Starte mit 'A'")
    Zustand = 2
}
function bestimmeZahlvonP0 (portWert3: number) {
    if (255 - portWert3 == 1) {
        einerWert = 6
    } else if (255 - portWert3 == 2) {
        einerWert = 7
    } else if (255 - portWert3 == 4) {
        einerWert = 8
    } else if (255 - portWert3 == 8) {
        einerWert = 9
    } else if (255 - portWert3 == 16) {
        einerWert = 0
    } else if (255 - portWert3 == 32) {
        zehnerWert = 60
    } else if (255 - portWert3 == 64) {
        zehnerWert = 70
    } else if (255 - portWert3 == 128) {
        zehnerWert = 80
    } else {
        fehler = 1
    }
}
function TestAusfuehrung () {
    if (TestGestartet == 1 && AufgabeAusstehend == 0) {
        if (RechenModus == 1) {
            Operation = randint(1, 2)
        }
        if (Operation == 1) {
            operationText = "+"
            while (Zahl1 + Zahl2 > 100 || Zahl1 + Zahl2 == 0) {
                Zahl1 = randint(0, 100)
                Zahl2 = randint(0, 100)
            }
            Ergebnis = Zahl1 + Zahl2
        } else {
            operationText = "-"
            while (Zahl1 - Zahl2 < 0 || Zahl1 - Zahl2 == 0) {
                Zahl1 = randint(0, 100)
                Zahl2 = randint(0, 100)
            }
            Ergebnis = Zahl1 - Zahl2
        }
        AufgabeAusstehend = 1
        ZeigeAufgabe = 1
    } else if (ZeigeAufgabe == 1) {
        I2C_LCD1602.clear()
        display(5, 1, convertToText("" + Zahl1 + " " + ("" + operationText) + " " + ("" + Zahl2) + " = ?"))
        basic.showString("?")
        ZeigeAufgabe = 0
        Startzeit = control.millis()
        Zustand = 3
    }
}
let operationText = ""
let Operation = 0
let RechenModus = 0
let ZeigeAufgabe = 0
let X = 0
let Y = 0
let fehler = 0
let Zahl2 = 0
let Zahl1 = 0
let EingabeBeendet = 0
let Startzeit = 0
let Endzeit = 0
let zehnerWert = 0
let einerWert = 0
let Ergebnis = 0
let AufgabeAusstehend = 0
let TestGestartet = 0
let P2 = 0
let P1 = 0
let P0 = 0
let Zustand = 0
InitHw()
InitSw()
display(0, 0, "Hallo")
display(0, 1, "Rechenkuenstler.")
display(0, 2, "Ich starte.")
basic.pause(1000)
Zustand = 1
basic.forever(function () {
    if (Zustand == 1) {
        Menu()
    } else if (Zustand == 2) {
        TestAusfuehrung()
    } else if (Zustand == 3) {
        PruefeEingabe()
    } else if (Zustand == 4) {
    	
    } else if (Zustand == 5) {
    	
    }
})
