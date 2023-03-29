import RPi.GPIO as GPIO
import time
import subprocess

GPIO.setmode(GPIO.BCM)

sensor_pin = 23

GPIO.setup(sensor_pin, GPIO.IN)

while True:
    if GPIO.input(sensor_pin):
        print("Movimiento detectado!")
        # Ejecutar el otro archivo de Python
        subprocess.run(["python", "/home/tebanuwu/Desktop/cam1.py"])
    time.sleep(0.1)

GPIO.cleanup()
