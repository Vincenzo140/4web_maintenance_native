import pytest
import requests
import random
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

# Gerar uma lista de máquinas para popular o banco de dados
def generate_machine_data():
    random_date = date.today() - timedelta(days=random.randint(1, 365))
    return {
        "name": f"Machine_{random.randint(1, 10000)}",
        "type": "Indústria",
        "model": f"Model_{random.randint(1, 100)}",
        "manufacture_data": str(random_date),
        "serial_number": f"SN_{random.randint(1000, 9999)}",
        "location": f"Sector_{random.randint(1, 10)}",
        "maintenance_history": []
    }

# Gerar uma lista de partes de reposição para popular o banco de dados
def generate_part_data():
    return {
        "name": f"Part_{random.randint(1, 10000)}",
        "code": f"Code_{random.randint(1000, 9999)}",
        "supplier": f"Supplier_{random.randint(1, 100)}",
        "quantity": random.randint(1, 100),
        "unit_price": random.uniform(10.0, 500.0)
    }

# Teste de integração para popular o banco de dados
def test_populate_database():
    # Registrar máquinas
    for _ in range(50):  # Registrar 50 máquinas
        machine_data = generate_machine_data()
        response = requests.post(f"{BASE_URL}/machines", json=machine_data)
        assert response.status_code == 201, f"Falha ao registrar máquina: {response.text}"

    # Registrar partes de reposição
    for _ in range(50):  # Registrar 50 partes de reposição
        part_data = generate_part_data()
        response = requests.post(f"{BASE_URL}/parts", json=part_data)
        assert response.status_code == 201, f"Falha ao registrar parte de reposição: {response.text}"

if __name__ == "__main__":
    pytest.main(["-s", "-v", __file__])
