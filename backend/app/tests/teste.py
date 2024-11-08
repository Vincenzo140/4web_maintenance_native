import pytest
import requests
from datetime import date, timedelta, time
import random

HOST = "0.0.0.0"
PORT = 8000

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

# Gerar uma lista de equipes para popular o banco de dados
def generate_team_data():
    return {
        "name": f"Team_{random.randint(1, 100)}",
        "members": [random.randint(1, 1000) for _ in range(random.randint(2, 5))]
    }

# para popular o banco de dados
def test_populate_database():
    # Registrar máquinas
    for _ in range(10):  # Registrar 10 máquinas
        machine_data = generate_machine_data()
        response = requests.post(f"http://{HOST}:{PORT}/machines", json=machine_data)
        assert response.status_code == 201, f"Falha ao registrar máquina: {response.text}"

    # Registrar partes de reposição
    for _ in range(10):  # Registrar 10 partes de reposição
        part_data = generate_part_data()
        response = requests.post(f"http://{HOST}:{PORT}/parts", json=part_data)
        assert response.status_code == 201, f"Falha ao registrar parte de reposição: {response.text}"

    # Registrar equipes de manutenção
    for _ in range(5):  # Registrar 5 equipes de manutenção
        team_data = generate_team_data()
        response = requests.post(f"http://{HOST}:{PORT}/teams", json=team_data)
        assert response.status_code == 201, f"Falha ao registrar equipe: {response.text}"

# Teste para obter todas as máquinas
def test_get_machines():
    response = requests.get(f"http://{HOST}:{PORT}/machines")
    assert response.status_code == 200, "Falha ao obter máquinas"
    machines = response.json()
    assert isinstance(machines, list), "O formato da resposta não é uma lista"
    assert len(machines) > 0, "Nenhuma máquina foi encontrada"

# Teste para obter todas as partes de reposição
def test_get_parts():
    response = requests.get(f"http://{HOST}:{PORT}/parts")
    assert response.status_code == 200, "Falha ao obter partes de reposição"
    parts = response.json()
    assert isinstance(parts, list), "O formato da resposta não é uma lista"
    assert len(parts) > 0, "Nenhuma parte de reposição foi encontrada"

# Teste para obter todas as equipes de manutenção
def test_get_teams():
    response = requests.get(f"http://{HOST}:{PORT}/teams")
    assert response.status_code == 200, "Falha ao obter equipes de manutenção"
    teams = response.json()
    assert isinstance(teams, list), "O formato da resposta não é uma lista"
    assert len(teams) > 0, "Nenhuma equipe foi encontrada"

if __name__ == "__main__":
    pytest.main(["-s", "-v", __file__])
