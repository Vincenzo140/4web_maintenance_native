import pytest
from faker import Faker
from fastapi.testclient import TestClient
from app_factory import create_app  # Usando apenas create_app

# Configuração inicial
fake = Faker()
app = create_app()  # Criando a instância do app para os testes
client = TestClient(app)

# Teste de Carga para Criação de Usuários
def test_create_users_load():
    num_users = 5  # Número de usuários para o teste de carga

    for _ in range(num_users):
        payload = {
            "username": fake.unique.user_name(),
            "password": fake.password(),
            "role": "user"  # Valor esperado como "user" ou "admin"
        }
        response = client.post("/users", json=payload)
        assert response.status_code == 201, f"Failed to create user. Status code: {response.status_code}, Response: {response.json()}"

# Teste de Carga para Registro de Equipes
def test_register_teams_load():
    num_teams = 5  # Número de equipes para o teste de carga

    for _ in range(num_teams):
        payload = {
            "name": fake.unique.company(),
            "members": [fake.name() for _ in range(3)],
            "specialites": [fake.job() for _ in range(2)]
        }
        response = client.post("/teams", json=payload)
        assert response.status_code == 201, f"Failed to register team. Status code: {response.status_code}, Response: {response.json()}"

# Teste de Carga para Registro de Manutenção
def test_register_maintenance_load():
    num_maintenance = 5  # Número de manutenções para o teste de carga

    for _ in range(num_maintenance):
        payload = {
            "maintenance_register_id": fake.unique.random_int(min=1, max=10000),
            "problem_description": fake.sentence(),
            "request_date": fake.date(),
            "priority": fake.random_element(elements=["Alta", "Média", "Baixa"]),
            "assigned_team_id": fake.uuid4(),  # Usar ID de equipe
            "status": fake.random_element(elements=["Aberta", "Fechada", "Em andamento"]),
            "machine_id": fake.bothify(text="machine_##")
        }
        response = client.post("/maintenance", json=payload)
        assert response.status_code == 201, f"Failed to register maintenance. Status code: {response.status_code}, Response: {response.json()}"

# Teste de Carga para Registro de Máquinas
def test_register_machines_load():
    num_machines = 15  # Número de máquinas para o teste de carga

    for _ in range(num_machines):
        payload = {
            "name": fake.word(),
            "type": fake.random_element(elements=["Tipo A", "Tipo B", "Tipo C"]),
            "model": fake.word(),
            "serial_number": fake.unique.bothify(text="SN###-??"),
            "location": fake.city(),
            "maintenance_history": [],  # Lista vazia inicial
            "status": fake.random_element(elements=["Operando", "Quebrado", "Em manutenção"])
        }
        response = client.post("/machines", json=payload)
        assert response.status_code == 201, f"Failed to register machine. Status code: {response.status_code}, Response: {response.json()}"
