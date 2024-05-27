def InitHw():
    I2C_LCD1602.lcd_init(39)
    pins.set_pull(DigitalPin.P0, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P1, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P2, PinPullMode.PULL_UP)
def leseTasten():
    global P0, P1, P2
    if pins.digital_read_pin(DigitalPin.P0) == 0:
        control.wait_micros(40000)
        P0 = pins.i2c_read_number(32, NumberFormat.UINT8_LE, False)
        bestimmeZahlvonP0(P0)
    if pins.digital_read_pin(DigitalPin.P1) == 0:
        control.wait_micros(40000)
        P1 = pins.i2c_read_number(33, NumberFormat.UINT8_LE, False)
        bestimmeZahlvonP1(P1)
    if pins.digital_read_pin(DigitalPin.P2) == 0:
        control.wait_micros(40000)
        P2 = pins.i2c_read_number(34, NumberFormat.UINT8_LE, False)
        bestimmeZahlvonP2(P2)
def PruefeEingabe():
    global Endzeit, EingabeBeendet, einerWert, zehnerWert, Zahl1, Zahl2, Zustand
    leseTasten()
    if Ergebnis > 10:
        if einerWert != 0 and zehnerWert != 0:
            Endzeit = control.millis() - Startzeit
            EingabeBeendet = 1
    elif einerWert != 0:
        Endzeit = control.millis() - Startzeit
        EingabeBeendet = 1
    if EingabeBeendet:
        if einerWert + zehnerWert == Ergebnis:
            basic.show_icon(IconNames.YES)
        else:
            basic.show_icon(IconNames.NO)
        display(14, 1, convert_to_text(Ergebnis))
        display(0, 2, "" + convert_to_text(Endzeit) + "ms")
        basic.pause(2000)
        I2C_LCD1602.clear()
        einerWert = 0
        zehnerWert = 0
        Zahl1 = 0
        Zahl2 = 0
        EingabeBeendet = 0
        Zustand = 2
def bestimmeZahlvonP2(portWert: number):
    global einerWert, zehnerWert, fehler
    if 255 - portWert == 1:
        einerWert = 1
    elif 255 - portWert == 2:
        einerWert = 2
    elif 255 - portWert == 4:
        einerWert = 3
    elif 255 - portWert == 8:
        einerWert = 4
    elif 255 - portWert == 16:
        einerWert = 5
    elif 255 - portWert == 32:
        zehnerWert = 10
    elif 255 - portWert == 64:
        zehnerWert = 20
    elif 255 - portWert == 128:
        zehnerWert = 30
    else:
        fehler = 1
def display(x: number, y: number, Text: str):
    global Y, X
    if y == 2:
        Y = 0
        X = x + 20
    elif y == 3:
        Y = 1
        X = x + 20
    else:
        Y = y
        X = x
    I2C_LCD1602.show_string(Text, X, Y)
def InitSw():
    global Ergebnis, einerWert, zehnerWert, TestGestartet, EingabeBeendet, Zustand
    Ergebnis = 0
    einerWert = 0
    zehnerWert = 0
    TestGestartet = 0
    EingabeBeendet = 0
    Zustand = 0
def bestimmeZahlvonP1(portWert2: number):
    global zehnerWert, fehler
    if 255 - portWert2 == 1:
        zehnerWert = 40
    elif 255 - portWert2 == 2:
        zehnerWert = 50
    elif 255 - portWert2 == 4:
        zehnerWert = 90
    elif 255 - portWert2 == 8:
        zehnerWert = 100
    else:
        fehler = 1
def Menu():
    global RechenModus, einerWert, Operation, TestGestartet, Zustand
    I2C_LCD1602.clear()
    display(0, 0, "SCHWARZE KNOEPFE")
    basic.pause(2000)
    I2C_LCD1602.clear()
    display(0, 0, "1 Plus & Minus")
    display(0, 1, "2 Plus")
    display(0, 2, "3 Minus")
    while einerWert == 0:
        leseTasten()
    RechenModus = einerWert
    einerWert = 0
    if RechenModus == 2:
        Operation = 1
    elif RechenModus == 3:
        Operation = 2
    I2C_LCD1602.clear()
    TestGestartet = 1
    Zustand = 2
def ZeigeAufgabe2():
    global Startzeit, Zustand
    I2C_LCD1602.clear()
    display(5,
        1,
        convert_to_text("" + str(Zahl1) + " " + ("" + operationText) + " " + ("" + str(Zahl2)) + " = ?"))
    basic.show_string("?")
    Startzeit = control.millis()
    Zustand = 4
def bestimmeAufgabe():
    global Operation, operationText, Zahl1, Zahl2, Ergebnis, Zustand
    if RechenModus == 1:
        Operation = randint(1, 2)
    if Operation == 1:
        operationText = "+"
        while Zahl1 + Zahl2 > 100 or Zahl1 + Zahl2 == 0:
            Zahl1 = randint(0, 100)
            Zahl2 = randint(0, 100)
        Ergebnis = Zahl1 + Zahl2
    else:
        operationText = "-"
        while Zahl1 - Zahl2 < 0 or Zahl1 - Zahl2 == 0:
            Zahl1 = randint(0, 100)
            Zahl2 = randint(0, 100)
        Ergebnis = Zahl1 - Zahl2
    Zustand = 3
def leseZahl():
    while einerWert == 0:
        leseTasten()
def bestimmeZahlvonP0(portWert3: number):
    global einerWert, zehnerWert, fehler
    if 255 - portWert3 == 1:
        einerWert = 6
    elif 255 - portWert3 == 2:
        einerWert = 7
    elif 255 - portWert3 == 4:
        einerWert = 8
    elif 255 - portWert3 == 8:
        einerWert = 9
    elif 255 - portWert3 == 16:
        einerWert = 0
    elif 255 - portWert3 == 32:
        zehnerWert = 60
    elif 255 - portWert3 == 64:
        zehnerWert = 70
    elif 255 - portWert3 == 128:
        zehnerWert = 80
    else:
        fehler = 1
operationText = ""
Operation = 0
RechenModus = 0
TestGestartet = 0
X = 0
Y = 0
fehler = 0
Zahl2 = 0
Zahl1 = 0
EingabeBeendet = 0
Startzeit = 0
Endzeit = 0
zehnerWert = 0
einerWert = 0
Ergebnis = 0
P2 = 0
P1 = 0
P0 = 0
Zustand = 0
InitHw()
InitSw()
basic.show_icon(IconNames.HAPPY)
display(0, 0, "Hallo")
display(0, 1, "Rechenkuenstler.")
display(0, 2, "Ich starte.")
basic.pause(1000)
Zustand = 1

def on_forever():
    if Zustand == 1:
        Menu()
    elif Zustand == 2:
        bestimmeAufgabe()
    elif Zustand == 3:
        ZeigeAufgabe2()
    elif Zustand == 4:
        PruefeEingabe()
    elif Zustand == 5:
        pass
basic.forever(on_forever)
