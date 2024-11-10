import pytest
from faker import Faker
from fastapi.testclient import TestClient
from main import app

fake = Faker()
client = TestClient(app)

# Teste de Carga para Criação de Usuários
def test_create_users_load():
    num_users = 5  # Número de usuários reduzido para teste de carga

    for _ in range(num_users):
        payload = {
            "username": fake.unique.user_name(),
            "password": fake.password(),
            "role": "user"  # O papel deve ser um valor esperado como "user" ou "admin"
        }
        response = client.post("/users", json=payload)
        assert response.status_code == 201, f"Failed to create user. Status code: {response.status_code}, Response: {response.json()}"

# Teste de Carga para Registro de Equipes
def test_register_teams_load():
    num_teams = 5  # Número de equipes reduzido para teste de carga

    for _ in range(num_teams):
        payload = {
            "name": fake.unique.company(),
            "members": [fake.name() for _ in range(3)],
            "specialites": [fake.job() for _ in range(2)]  # Corrigir nome para 'specialites', que é o nome correto no modelo
        }
        response = client.post("/teams", json=payload)
        assert response.status_code == 201, f"Failed to register team. Status code: {response.status_code}, Response: {response.json()}"

# Teste de Carga para Registro de Partes de Reposição
def test_register_parts_load():
    num_parts = 5  # Número de partes reduzido para teste de carga

    for _ in range(num_parts):
        payload = {
            "name": fake.word(),
            "code": fake.unique.bothify(text="P###"),  # Usar 'fake.unique' para garantir um código único
            "supplier": fake.company(),
            "quantity": fake.random_int(min=1, max=100),
            "unit_price": round(fake.pyfloat(left_digits=2, right_digits=2, positive=True), 2),
            "description": fake.sentence()  # Adicionar uma descrição para garantir que todos os campos estejam preenchidos
        }
        response = client.post("/parts", json=payload)
        assert response.status_code == 201, f"Failed to register part. Status code: {response.status_code}, Response: {response.json()}"

# Teste de Carga para Registro de Manutenção
def test_register_maintenance_load():
    num_maintenance = 5  # Número de manutenções reduzido para teste de carga

    for _ in range(num_maintenance):
        payload = {
            "maintenance_register_id": fake.unique.random_int(min=1, max=10000),
            "name": fake.bs(),  # Adicionar um nome para a manutenção
            "problem_description": fake.sentence(),
            "request_date": fake.date(),
            "priority": fake.random_element(elements=["Alta", "Média", "Baixa"]),
            "assigned_team": fake.company(),
            "status": fake.random_element(elements=["Aberta", "Fechada", "Em andamento"]),
            "machine_id": fake.bothify(text="machine_##")
        }
        response = client.post("/maintenance", json=payload)
        assert response.status_code == 201, f"Failed to register maintenance. Status code: {response.status_code}, Response: {response.json()}"

def test_register_machines_load():
    num_machines = 5  # Número de máquinas reduzido para teste de carga

    for _ in range(num_machines):
        payload = {
            "serial_number": fake.unique.bothify(text="SN###-??"),
            "name": fake.word(),
            "manufacturer": fake.company(),
            "manufacture_date": fake.date(),
            "model": fake.word(),
            "specifications": fake.sentence(),
            "type": fake.random_element(elements=["Tipo A", "Tipo B", "Tipo C"]),  # Campo 'type' obrigatório
            "location": fake.city(),  # Campo 'location' obrigatório
            "maintenance_history": [],  # Campo 'maintenance_history' obrigatório (iniciando como uma lista vazia)
            "status": fake.random_element(elements=["operando", "Quebrado", "Em Manuntenção"])  # Campo 'status' obrigatório (com valores válidos)
        }
        response = client.post("/machines", json=payload)
        assert response.status_code == 201, f"Failed to register machine. Status code: {response.status_code}, Response: {response.json()}"

