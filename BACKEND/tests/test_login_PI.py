import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Test para verificar el flujo completo de registro y login.
def test_registro_y_login_exitoso():
    # 1. Datos del usuario para el registro.
    # Usa un correo que no exista para evitar conflictos.
    usuario_a_registrar = {
        "nombre": "Test User",
        "correo": "test_user_temp@example.com",
        "contraseña": "password123",
        "rol_id": 2 # Asume que el rol de cliente es el 2
    }

    # 2. Registrar el nuevo usuario. Esto crea un hash de la contraseña.
    response_registro = client.post("/usuarios/register", json=usuario_a_registrar)
    assert response_registro.status_code == 200
    
    # 3. Datos para el login (misma contraseña en texto plano).
    usuario_para_login = {
        "correo": "test_user_temp@example.com",
        "contraseña": "password123"
    }

    # 4. Intentar el login. Ahora la contraseña en la BD está hasheada.
    response_login = client.post("/usuarios/login", json=usuario_para_login)
    
    # 5. Revisa que el login fue exitoso.
    assert response_login.status_code == 200
    assert "access_token" in response_login.json()
    assert response_login.json()["correo"] == "test_user_temp@example.com"