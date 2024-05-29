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
    debug = 1
})
function PruefeEingabe () {
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
        einerWert = 0
        zehnerWert = 0
        Zahl1 = 0
        Zahl2 = 0
        EingabeBeendet = 0
        Zustand = 2
    }
}
function bestimmeZahlvonP2 (portWert: number) {
    if (255 - portWert == 1) {
        EingabeZeichen = "0"
    } else if (255 - portWert == 2) {
        EingabeZeichen = "1"
    } else if (255 - portWert == 4) {
        EingabeZeichen = "2"
    } else if (255 - portWert == 8) {
        EingabeZeichen = "3"
    } else if (255 - portWert == 16) {
        EingabeZeichen = "4"
    } else if (255 - portWert == 32) {
        EingabeZeichen = "del"
    } else if (255 - portWert == 64) {
        EingabeZeichen = ""
    } else if (255 - portWert == 128) {
        EingabeZeichen = ""
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
    EingabeBeendet = 0
    Zustand = 0
    debug = 0
}
function bestimmeZahlvonP1 (portWert2: number) {
    if (255 - portWert2 == 1) {
        EingabeZeichen = ""
    } else if (255 - portWert2 == 2) {
        EingabeZeichen = "down"
    } else if (255 - portWert2 == 4) {
        EingabeZeichen = ""
    } else if (255 - portWert2 == 8) {
        EingabeZeichen = "e"
    }
}
function Menu () {
    I2C_LCD1602.clear()
    display(0, 0, "SCHWARZE KNOEPFE")
    basic.pause(2000)
    I2C_LCD1602.clear()
    display(0, 0, "1 Plus & Minus & Mal")
    display(0, 1, "2 Plus")
    display(0, 2, "3 Minus")
    display(0, 3, "4 Mal")
    while (EingabeZeichen.isEmpty()) {
        leseTasten()
    }
    RechenModus = parseFloat(EingabeZeichen)
    if (RechenModus == 2) {
        Operation = 1
    } else if (RechenModus == 3) {
        Operation = 2
    } else if (RechenModus == 4) {
        Operation = 3
    }
    I2C_LCD1602.clear()
    TestGestartet = 1
    Zustand = 2
}
function ZeigeAufgabe2 () {
    I2C_LCD1602.clear()
    display(5, 1, convertToText("" + Zahl1 + " " + ("" + operationText) + " " + ("" + Zahl2) + " = ?"))
    basic.showString("?")
    Startzeit = control.millis()
    Zustand = 4
}
function bestimmeAufgabe () {
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
    Zustand = 3
}
function leseZahl () {
    while (true) {
        leseTasten()
        if (EingabeZeichen.isEmpty()) {
            continue;
        }
        if (EingabeZeichen.compare("del") == 0) {
            EingabeZahl = EingabeZahl.substr(0, EingabeZahl.length - 1)
        } else {
            EingabeZahl = "" + EingabeZahl + EingabeZeichen
        }
        if (debug) {
            display(0, 3, EingabeZeichen)
            display(5, 3, "               ")
            display(5, 3, EingabeZahl)
        }
        if (EingabeZeichen.compare("e") == 0) {
            break;
        } else {
            EingabeZeichen = ""
        }
    }
}
function bestimmeZahlvonP0 (portWert3: number) {
    if (255 - portWert3 == 1) {
        EingabeZeichen = "5"
    } else if (255 - portWert3 == 2) {
        EingabeZeichen = "6"
    } else if (255 - portWert3 == 4) {
        EingabeZeichen = "7"
    } else if (255 - portWert3 == 8) {
        EingabeZeichen = "8"
    } else if (255 - portWert3 == 16) {
        EingabeZeichen = "9"
    } else if (255 - portWert3 == 32) {
        EingabeZeichen = "up"
    } else if (255 - portWert3 == 64) {
        EingabeZeichen = ""
    } else if (255 - portWert3 == 128) {
        EingabeZeichen = ""
    }
}
let EingabeZahl = ""
let operationText = ""
let Operation = 0
let RechenModus = 0
let TestGestartet = 0
let X = 0
let Y = 0
let EingabeZeichen = ""
let Zahl2 = 0
let Zahl1 = 0
let EingabeBeendet = 0
let Startzeit = 0
let Endzeit = 0
let zehnerWert = 0
let einerWert = 0
let Ergebnis = 0
let debug = 0
let P2 = 0
let P1 = 0
let P0 = 0
let Zustand = 0
InitHw()
InitSw()
basic.showIcon(IconNames.Happy)
display(0, 0, "Hallo")
display(0, 1, "Rechenkuenstler.")
display(0, 2, "Ich starte.")
basic.pause(1000)
Zustand = 1
basic.forever(function () {
    if (Zustand == 1) {
        Menu()
    } else if (Zustand == 2) {
        bestimmeAufgabe()
    } else if (Zustand == 3) {
        ZeigeAufgabe2()
    } else if (Zustand == 4) {
        PruefeEingabe()
    } else if (Zustand == 5) {
    	
    }
})
