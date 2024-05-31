function InitHw () {
    I2C_LCD1602.LcdInit(39)
    pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
}
function Statistik () {
	
}
function leseTasten () {
    EingabeZeichen = ""
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
function BestimmeZufallsoperation () {
    Operation = randint(1, 3)
    if (Operation == 1) {
        operationText = "+"
    } else if (Operation == 2) {
        operationText = "-"
    } else if (Operation == 3) {
        operationText = "*"
    }
}
function ZeigeAufgabe () {
    I2C_LCD1602.clear()
    AufgabenText = convertToText("" + Zahl1 + " " + ("" + operationText) + " " + ("" + Zahl2) + " = ?")
    display2(5, 1, AufgabenText)
    basic.showString("?")
    Startzeit = control.millis()
    Zustand = 4
}
function PruefeEingabe () {
    leseZahl()
    Endzeit = control.millis() - Startzeit
    if (parseFloat(EingabeZahl) == Ergebnis) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
        display2(4 + AufgabenText.length, 2, convertToText(Ergebnis))
    }
    display2(0, 3, "" + convertToText(Endzeit) + "ms")
    basic.pause(2000)
    I2C_LCD1602.clear()
    Zahl1 = 0
    Zahl2 = 0
    EingabeZahl = ""
    Zustand = 2
    if (SchonGerechneteAufgaben == AufgabenAnzahl) {
        Zustand = 5
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
function display2 (x: number, y: number, Text: string) {
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
    SchonGerechneteAufgaben = 0
    Ergebnis = 0
    TestGestartet = 0
    Zustand = 0
    Zahl1 = 0
    Zahl2 = 0
    AufgabenAnzahl = 0
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
    display2(0, 0, "SCHWARZE KNOEPFE")
    basic.pause(2000)
    I2C_LCD1602.clear()
    display2(0, 0, "1 Plus & Minus & Mal")
    display2(0, 1, "2 Plus")
    display2(0, 2, "3 Minus")
    display2(0, 3, "4 Mal")
    while (EingabeZeichen.isEmpty() || (parseFloat(EingabeZeichen) < 1 || parseFloat(EingabeZeichen) > 4)) {
        leseTasten()
    }
    RechenModus = parseFloat(EingabeZeichen)
    if (RechenModus == 2) {
        MenuAnzahlAufgaben()
        operationText = "+"
    } else if (RechenModus == 3) {
        MenuAnzahlAufgaben()
        operationText = "-"
    } else if (RechenModus == 4) {
        MenuAnzahlAufgaben()
        operationText = "*"
    }
    I2C_LCD1602.clear()
    TestGestartet = 1
    Zustand = 2
}
function MenuAnzahlAufgaben () {
    I2C_LCD1602.clear()
    display2(0, 0, "Anzahl Aufgaben")
    display2(0, 1, "1>5 Aufgaben")
    display2(0, 2, "2>10 Aufgaben")
    display2(0, 3, "3>15 Aufgaben")
    EingabeZeichen = ""
    while (EingabeZeichen.isEmpty() || (parseFloat(EingabeZeichen) < 1 || parseFloat(EingabeZeichen) > 3)) {
        leseTasten()
    }
    if (parseFloat(EingabeZeichen) == 1) {
        AufgabenAnzahl = 5
    } else if (parseFloat(EingabeZeichen) == 2) {
        AufgabenAnzahl = 10
    } else if (parseFloat(EingabeZeichen) == 3) {
        AufgabenAnzahl = 15
    }
    list = [1, AufgabenAnzahl]
}
function bestimmeAufgabe () {
    if (RechenModus == 1) {
        MenuAnzahlAufgaben()
        BestimmeZufallsoperation()
    }
    if (operationText.compare("+") == 0) {
        while (true) {
            Zahl1 = randint(0, 100)
            Zahl2 = randint(0, 100)
            Ergebnis = Zahl1 + Zahl2
            if (Ergebnis < 100) {
                break;
            }
        }
    } else if (operationText.compare("*") == 0) {
        while (true) {
            Zahl1 = randint(0, 10)
            Zahl2 = randint(0, 10)
            Ergebnis = Zahl1 * Zahl2
            if (Ergebnis < 100) {
                break;
            }
        }
    } else {
        while (true) {
            Zahl1 = randint(0, 100)
            Zahl2 = randint(0, 100)
            Ergebnis = Zahl1 - Zahl2
            if (Ergebnis > 0) {
                break;
            }
        }
    }
    SchonGerechneteAufgaben = SchonGerechneteAufgaben + 1
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
            if (EingabeZeichen.compare("e") == 0) {
                EingabeZeichen = ""
                break;
            }
            EingabeZahl = "" + EingabeZahl + EingabeZeichen
        }
        display2(4 + AufgabenText.length, 1, "   ")
        display2(4 + AufgabenText.length, 1, EingabeZahl)
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
let list: number[] = []
let RechenModus = 0
let TestGestartet = 0
let X = 0
let Y = 0
let AufgabenAnzahl = 0
let SchonGerechneteAufgaben = 0
let Ergebnis = 0
let EingabeZahl = ""
let Endzeit = 0
let Startzeit = 0
let Zahl2 = 0
let Zahl1 = 0
let AufgabenText = ""
let operationText = ""
let Operation = 0
let P2 = 0
let P1 = 0
let P0 = 0
let EingabeZeichen = ""
let Zustand = 0
InitHw()
InitSw()
basic.showIcon(IconNames.Happy)
display2(0, 0, "Hallo")
display2(0, 1, "Rechenkuenstler.")
display2(0, 2, "Ich starte.")
basic.pause(1000)
Zustand = 1
basic.forever(function () {
    if (Zustand == 1) {
        Menu()
    } else if (Zustand == 2) {
        bestimmeAufgabe()
    } else if (Zustand == 3) {
        ZeigeAufgabe()
    } else if (Zustand == 4) {
        PruefeEingabe()
    } else if (Zustand == 5) {
    	
    }
})
