import pytest
from fastapi.testclient import TestClient
from main import app
import random
import string

client = TestClient(app)

def generate_random_email():
    #Genera un correo electrónico único y aleatorio para las pruebas."""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_user_{random_string}@example.com"

def test_login_exitoso():
    
    #Prueba de integración automatizada para verificar el flujo completo de
    #registro y login de un usuario.

    # Se genera un correo único para evitar conflictos con ejecuciones anteriores.
    unique_email = generate_random_email()

    # Datos para el usuario que se va a registrar.
    usuario_a_registrar = {
        "nombre": "Test User",
        "correo": unique_email,
        "contraseña": "password123",
        "rol_id": 2 # Asume que el rol de cliente es 2
    }

    # 1. PASO AUTOMATIZADO: Registrar al nuevo usuario.
    response_registro = client.post("/usuarios/register", json=usuario_a_registrar)
    assert response_registro.status_code == 200, "El registro del usuario falló"

    # Datos para el login. Se usa el mismo correo y contraseña en texto plano.
    usuario_para_login = {
        "correo": unique_email,
        "contraseña": "password123"
    }

    # 2. PASO AUTOMATIZADO: Intentar el login con el usuario creado.
    response_login = client.post("/usuarios/login", json=usuario_para_login)
    
    # 3. VERIFICACIONES AUTOMÁTICAS: Comprueba que el login fue exitoso.
    assert response_login.status_code == 200, "El login falló con credenciales correctas"
    assert "access_token" in response_login.json(), "No se recibió un token de acceso"
    assert response_login.json()["correo"] == unique_email, "El correo en la respuesta del login no coincide"
