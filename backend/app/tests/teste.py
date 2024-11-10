import pytest
import requests
from multiprocessing import Pool
import time

# URL base do servidor
BASE_URL = "http://localhost:8000"

# Função para criar uma nova máquina (POST /machines)
def create_machine():
    machine_data = {
        "name": "Maquina Teste",
        "type": "Industrial",
        "model": "Mod-XYZ",
        "manufacture_data": "2022-01-01",
        "serial_number": "SN-123456",
        "location": "Linha de produção A",
        "maintenance_history": ["Substituição de motor em 2023"],
        "status": "operando"
    }
    response = requests.post(f"{BASE_URL}/machines", json=machine_data)
    return response

# Função para criar uma nova manutenção (POST /maintenance)
def create_maintenance():
    maintenance_data = {
        "maintenance_register_id": 1,
        "problem_description": "Problema no motor",
        "request_date": "2024-01-01",
        "priority": "Alta",
        "assigned_team": "Equipe A",
        "status": "Aberto",
        "machine_id": "SN-123456"
    }
    response = requests.post(f"{BASE_URL}/maintenance", json=maintenance_data)
    return response

# Função para criar uma nova parte de reposição (POST /parts)
def create_part():
    part_data = {
        "name": "Peça Teste",
        "code": "P-123456",
        "supplier": "Fornecedor A",
        "quantity": 10,
        "unit_price": 50.0
    }
    response = requests.post(f"{BASE_URL}/parts", json=part_data)
    return response

# Função para registrar uma nova equipe de manutenção (POST /teams)
def create_team():
    team_data = {
        "name": "Equipe Teste",
        "members": [1, 2, 3],
        "specialites": "Mecânica"
    }
    response = requests.post(f"{BASE_URL}/teams", json=team_data)
    return response

# Testes unitários usando pytest
@pytest.mark.parametrize("serial_number, status_code", [
    ("SN-123456", 200),
    ("SN-000000", 404),
])
def test_get_machine(serial_number, status_code):
    response = requests.get(f"{BASE_URL}/machines/{serial_number}")
    assert response.status_code == status_code

# Testes de integração usando pytest
def test_create_machine():
    response = create_machine()
    assert response.status_code == 201
    assert response.json()["serial_number"] == "SN-123456"

def test_create_maintenance():
    response = create_maintenance()
    assert response.status_code == 201
    assert response.json()["maintenance_register_id"] == 1

def test_create_part():
    response = create_part()
    assert response.status_code == 201
    assert response.json()["code"] == "P-123456"

def test_create_team():
    response = create_team()
    assert response.status_code == 201
    assert response.json()["name"] == "Equipe Teste"

# Teste de carga simples para criar múltiplas máquinas
def load_test_create_machine(instance):
    print(f"Criando máquina {instance}")
    response = create_machine()
    return response.status_code

def load_test_create_maintenance(instance):
    print(f"Criando manutenção {instance}")
    response = create_maintenance()
    return response.status_code

def load_test_create_part(instance):
    print(f"Criando parte {instance}")
    response = create_part()
    return response.status_code

def load_test_create_team(instance):
    print(f"Criando equipe {instance}")
    response = create_team()
    return response.status_code

# Função de teste de carga para testar os endpoints POST
# Configurando para criar múltiplas entradas simultaneamente
def test_load_create_machine():
    start_time = time.time()
    with Pool(10) as p:  # Teste com 10 máquinas simultâneas
        results = p.map(load_test_create_machine, range(10))
    
    # Verificando se todos os resultados são 201 (Criado com sucesso)
    assert all(result == 201 for result in results)
    elapsed_time = time.time() - start_time
    print(f"Teste de carga de máquinas finalizado em {elapsed_time} segundos")

def test_load_create_maintenance():
    start_time = time.time()
    with Pool(10) as p:  # Teste com 10 manutenções simultâneas
        results = p.map(load_test_create_maintenance, range(10))
    
    # Verificando se todos os resultados são 201 (Criado com sucesso)
    assert all(result == 201 for result in results)
    elapsed_time = time.time() - start_time
    print(f"Teste de carga de manutenções finalizado em {elapsed_time} segundos")

def test_load_create_part():
    start_time = time.time()
    with Pool(10) as p:  # Teste com 10 partes simultâneas
        results = p.map(load_test_create_part, range(10))
    
    # Verificando se todos os resultados são 201 (Criado com sucesso)
    assert all(result == 201 for result in results)
    elapsed_time = time.time() - start_time
    print(f"Teste de carga de partes finalizado em {elapsed_time} segundos")

def test_load_create_team():
    start_time = time.time()
    with Pool(10) as p:  # Teste com 10 equipes simultâneas
        results = p.map(load_test_create_team, range(10))
    
    # Verificando se todos os resultados são 201 (Criado com sucesso)
    assert all(result == 201 for result in results)
    elapsed_time = time.time() - start_time
    print(f"Teste de carga de equipes finalizado em {elapsed_time} segundos")

if __name__ == "__main__":
    # Executando os testes unitários e de integração com pytest
    pytest.main(["-v", "-s", __file__])
