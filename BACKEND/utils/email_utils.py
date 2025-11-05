import smtplib
from email.mime.text import MIMEText
from email.message import EmailMessage

def enviar_alerta_stock(destinatario, producto, cantidad):
    remitente = "josnishop@gmail.com"
    password = "iyzn auso rqox thkm"
    asunto = "¡Atención! Stock bajo en JosniShop"
    cuerpo = f"""
Hola,

Queremos informarte que el producto '{producto}' está por agotarse.
Actualmente solo quedan {cantidad} unidades disponibles.

Te recomendamos revisar el inventario y tomar las acciones necesarias en tu panel.

Saludos,
El equipo de JosniShop
"""
    msg = MIMEText(cuerpo)
    msg["Subject"] = asunto
    msg["From"] = remitente
    msg["To"] = destinatario

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(remitente, password)
            server.sendmail(remitente, destinatario, msg.as_string())
    except Exception as e:
        print("Error enviando correo:", e)

def enviar_confirmacion_compra(correo, pedido_id):
    remitente = "josnishop@gmail.com"
    password = "iyzn auso rqox thkm"
    asunto = "¡Gracias por tu compra en JosniShop!"
    cuerpo = f"""
Hola,

¡Tu compra ha sido confirmada exitosamente!
Tu número de pedido es: {pedido_id}

Puedes consultar el estado de tu pedido en tu panel de usuario.

Gracias por confiar en JosniShop.
"""
    msg = EmailMessage()
    msg.set_content(cuerpo)
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = correo

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(remitente, password)
            server.send_message(msg)
    except Exception as e:
        print("Error enviando correo:", e)

def send_registration_email(to_email):
    remitente = "josnishop@gmail.com"
    password = "iyzn auso rqox thkm"
    subject = "Registro exitoso en JosniShop"
    body = (
        "¡Bienvenido a JosniShop!\n\n"
        "Te has registrado exitosamente y has aceptado los términos y condiciones del sistema.\n"
        "Gracias por confiar en nosotros."
    )
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = remitente
    msg["To"] = to_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(remitente, password)
            server.sendmail(remitente, to_email, msg.as_string())
    except Exception as e:
        print("Error enviando correo:", e)

def enviar_alerta_resena(destinatario, producto, comentario, calificacion):
    remitente = "josnishop@gmail.com"
    password = "iyzn auso rqox thkm"
    asunto = "¡Nueva reseña en tu producto JosniShop!"
    cuerpo = f"""
Hola,

Has recibido una nueva reseña en tu producto '{producto}'.

Calificación: {calificacion} estrellas
Comentario: {comentario}

Revisa tu panel para responder o gestionar la reseña.

Saludos,
El equipo de JosniShop
"""
    msg = MIMEText(cuerpo)
    msg["Subject"] = asunto
    msg["From"] = remitente
    msg["To"] = destinatario

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(remitente, password)
            server.sendmail(remitente, destinatario, msg.as_string())
    except Exception as e:
        print("Error enviando correo:", e)