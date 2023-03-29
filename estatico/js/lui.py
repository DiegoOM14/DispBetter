import RPi.GPIO as GPIO
import time
import pymongo
from bson.objectid import ObjectId
from datetime import datetime
from loguru import logger

servo_pins = [15, 18, 21] # Estos son los pines GPIO a los que están conectados los servos
buzzer_pin = 23 # Este es el pin GPIO al que está conectado el buzzer

# Establece el modo del pin y configura los servos
GPIO.setmode(GPIO.BCM)
GPIO.setup(buzzer_pin, GPIO.OUT)
servos = []
for pin in servo_pins:
    GPIO.setup(pin, GPIO.OUT)
    servo = GPIO.PWM(pin, 50)
    servo.start(8)
    servos.append(servo)

# Función para activar el buzzer
def activar_buzzer():
    GPIO.output(buzzer_pin, GPIO.HIGH) # Activa el buzzer
    time.sleep(0.1) # Espera 0.1 segundos
    GPIO.output(buzzer_pin, GPIO.LOW) # Desactiva el buzzer

# Función para mover el servo
def mover_servo(servo, fecha, nombre_alarma):
    angulo = 90 # Angulo por defecto
    servos[servo - 1].ChangeDutyCycle(5) # Cambia el punto PWM del servo correspondiente al ángulo 0
    activar_buzzer() # Activa el buzzer
    time.sleep(0.3) # Espera 0.3 segundos
    servos[servo - 1].ChangeDutyCycle(10) # Cambia el punto PWM del servo correspondiente al ángulo 180
    activar_buzzer() # Activa el buzzer
    time.sleep(0.3) # Espera 0.3 segundos
    servos[servo - 1].ChangeDutyCycle(0) # Detiene el PWM
    logger.info(f"Alarma '{nombre_alarma}' activada en servo {servo} a las {fecha}")

# Conexión a la base de datos de MongoDB
try:
    cliente = pymongo.MongoClient('mongodb+srv://teban:teban@cluster0.2vvboa7.mongodb.net/?retryWrites=true&w=majority')
    db = cliente.test
    coleccion = db.alarms
except Exception as e:
    logger.error(f"No se pudo conectar a la base de datos: {e}")

# Bucle principal
while True:
    # Busca las alarmas que están pendientes de activar
    ahora = datetime.now()
    alarmas = db.alarms.find({
        "date": {"$lte": ahora},
        "active": False
    })

    # Activa las alarmas encontradas
    for alarma in alarmas:
        servo = alarma["servo"]
        fecha = alarma["date"].strftime("%Y-%m-%d %H:%M:%S") # Convertir fecha a string
        nombre_alarma = alarma["name"]
        contador = alarma["contador"]
        mover_servo(servo, fecha, nombre_alarma,contador)
        db.alarms.update_one({"_id": ObjectId(alarma["_id"])}, {"$set": {"active": True}})

         # Añade una entrada al registro de actividad
    registro_actividad = {"accion": f"Activada alarma '{nombre_alarma}' en servo {servo}", "fecha": ahora}
    db.alarms.insert_one(registro_actividad)

    time.sleep(30) # Espera un minuto antes de volver

