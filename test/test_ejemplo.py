def sumar(a, b):
    """Suma dos números."""
    return a + b
# El nombre de la función de prueba también debe comenzar con 'test_'
def test_sumar_numeros_positivos():
    # La aserción es la parte clave del test
    assert sumar(2, 3) == 5

def test_sumar_numeros_negativos():
    assert sumar(-1, -1) == -2

def test_sumar_un_positivo_y_un_negativo():
    assert sumar(5, -3) == 2