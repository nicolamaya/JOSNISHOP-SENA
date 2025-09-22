from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_recuperar_contrasena_correo_no_existente():
    """
    Verifica que la solicitud de recuperación de contraseña para un correo
    que no existe en la base de datos devuelve un error 404.
    """
    # Correo que no existe en la base de datos.
    correo_inexistente = "usuario_no_existe@mail.com"

    # Datos para la solicitud de recuperación de contraseña.
    request_data = {
        "email": correo_inexistente
    }

    # Se envía la solicitud.
    response = client.post("/usuarios/recuperar-contrasena", json=request_data)

    # 1. Verifica el código de estado HTTP.
    # Se espera un 404 (No Encontrado), ya que el usuario no existe.
    assert response.status_code == 404
    
    # 2. Verifica el mensaje de error.
    assert response.json() == {"detail": "Usuario no encontrado"}