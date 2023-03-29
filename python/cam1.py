import cv2
from pymongo import MongoClient
import datetime
import time
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

# Conexión con la base de datos MongoDB
client = MongoClient('mongodb+srv://teban:teban@cluster0.2vvboa7.mongodb.net/test')
db = client.test
collection = db.contador
email_collection = db.usuarios

# Obtener el correo electrónico del destinatario
Prueba = email_collection.find_one()

# Inicializar la cámara
cap = cv2.VideoCapture(0)

# Obtener la fecha y hora de inicio
start_time = time.time()

while True:
    # Capturar un frame de la cámara
    ret, frame = cap.read()

    # Obtener la fecha y hora actual
    now = datetime.datetime.now()

    # Generar el nombre de archivo basado en la fecha y hora actual
    filename = now.strftime("%Y-%m-%d_%H-%M-%S.png")

    # Agregar la fecha y hora a la imagen
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(frame, now.strftime("%Y-%m-%d %H:%M:%S"), (10, 50), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

    # Guardar la imagen en formato PNG con el nombre generado
    cv2.imwrite(filename, frame)

    # Leer la imagen y convertirla a bytes
    with open(filename, "rb") as image_file:
        encoded_string = image_file.read()

    # Crear un objeto de datos y guardarlo en la base de datos
    data = {
        "fecha_hora": now,
        "imagen": encoded_string
    }
    collection.insert_one(data)

    # Mostrar la imagen en una ventana
    cv2.imshow("Captura", frame)

    # Verificar si han pasado 5 segundos desde el inicio del programa
    if time.time() - start_time > 5:
        break

# Enviar correo electrónico
    correo_origen = 'luisfelipecruzesteban398@gmail.com'
    contraseña = 'nqcxqmcaxmlfcdlw'
    correo_destino = Prueba["email"]

    # Crear mensaje
    msg = MIMEMultipart()
    msg['Subject'] = 'Prueba de Toma de Pastilla :)'
    msg['From'] = correo_origen
    msg['To'] = correo_destino

    # Agregar imagen al mensaje
    with open(filename, 'rb') as fp:
        img = MIMEImage(fp.read())
        msg.attach(img)

    # Enviar correo electrónico
    server = smtplib.SMTP('smtp.gmail.com',587)
    server.starttls()
    server.login(correo_origen,contraseña)
    server.sendmail(correo_origen,correo_destino,msg.as_string())

    server.quit()

# Liberar los recursos
cap.release()
cv2.destroyAllWindows()
