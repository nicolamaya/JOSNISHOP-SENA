from fastapi.testclient import TestClient
from main import app
import random
import string

client = TestClient(app)

def generate_random_email():
    """Genera un correo electrónico único y aleatorio para las pruebas."""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_user_{random_string}@example.com"

def test_registro_usuario_exitoso():
    """Verifica que el registro de un nuevo usuario funcione correctamente."""
    
    unique_email = generate_random_email()
    
    nuevo_usuario = {
        "nombre": "Nuevo Cliente",
        "correo": unique_email,
        "contraseña": "password_segura",
        "rol_id": 2 # Asume que 2 es el rol de cliente
    }
    response = client.post("/usuarios/register", json=nuevo_usuario)
    
    # La prueba espera un código de estado 200 para pasar.
    assert response.status_code == 200
    assert "msg" in response.json()
    assert response.json()["msg"] == "Usuario creado"