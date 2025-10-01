from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login_exitoso():
    
    #Verifica que el inicio de sesión con credenciales válidas funcione.
    #Se crea un usuario de prueba para la verificación
    test_user_data = {
        "nombre": "Usuario Test",
        "correo": "login_test@mail.com",
        "contraseña": "test_password",
        "rol_id": 2
    }
    client.post("/usuarios/register", json=test_user_data) # El registro se encarga de encriptar la contraseña

    # Ahora se intenta iniciar sesión con las credenciales en texto plano
    login_data = {
        "correo": "login_test@mail.com",
        "contraseña": "test_password"
    }
    response = client.post("/usuarios/login", json=login_data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"