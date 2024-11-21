import pytest
from unittest.mock import MagicMock
from main import (
    create_user,
    register_teams_on_maintenance,
    post_parts_of_reposition,
    maintenance_register,
    get_password_hash,
    CreateUserAccount,
    Teams,
    PostPartsOfReposition,
    Maintenance,
)

# Teste Unitário para Criar um Usuário
def test_create_user():
    user = CreateUserAccount(username="usuario_teste", password="senha123", role="admin")
    redis_client = MagicMock()
    redis_client.exists.return_value = False

    response = create_user(user, redis_client)

    # Verificações
    assert response.username == user.username
    assert redis_client.set.called
    assert redis_client.sadd.called
    hashed_password = get_password_hash(user.password)
    assert hashed_password != user.password

# Teste Unitário para Registrar uma Nova Equipe
def test_register_team():
    # Corrigido: Adicionando o campo obrigatório specialties corretamente
    team = Teams(name="Equipe Alfa", members=["membro1", "membro2"], specialites=["especialidade1"])
    redis_client = MagicMock()
    redis_client.exists.return_value = False

    response = register_teams_on_maintenance(team, redis_client)

    # Verificações
    assert response.name == team.name
    assert redis_client.set.called
    assert redis_client.sadd.called

# Teste Unitário para Registrar uma Nova Parte de Reposição
def test_register_part():
    part = PostPartsOfReposition(name="Parte Teste", code="P001", supplier="Fornecedor X", quantity=10, unit_price=25.5)
    redis_client = MagicMock()
    redis_client.exists.return_value = False

    response = post_parts_of_reposition(part, redis_client)

    # Verificações
    assert response.name == part.name
    assert redis_client.set.called
    assert redis_client.sadd.called

# Teste Unitário para Registrar uma Nova Manutenção
def test_register_maintenance():
    # Corrigido: Adicionando os campos obrigatórios priority, assigned_team e status
    maintenance = Maintenance(
        maintenance_register_id=1,
        name="Manutenção Preventiva",
        problem_description="Verificação geral",
        request_date="2024-11-01",
        priority="Alta",
        assigned_team="Equipe Alfa",
        status="Aberta",
        machine_id="machine_123"
    )
    redis_client = MagicMock()
    redis_client.exists.return_value = False

    response = maintenance_register(maintenance, redis_client)

    # Verificações
    assert response.maintenance_register_id == maintenance.maintenance_register_id
    assert redis_client.set.called
    assert redis_client.sadd.called

if __name__ == "__main__":
    pytest.main()
