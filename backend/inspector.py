import subprocess
import matplotlib.pyplot as plt
import random
import os

def plot_git_commits():
    # Executar o comando git shortlog -s e capturar a saída
    output = subprocess.run(["git", "shortlog", "-s"], capture_output=True, text=True)
    output_lines = output.stdout.splitlines()

    # Extrair nomes de colaboradores e números de commits
    contribuidores = []
    num_commits = []
    for line in output_lines:
        parts = line.split()
        num_commits.append(int(parts[0]))
        contribuidores.append(' '.join(parts[1:]))

    # Caminho para o diretório 'resources' dentro do diretório do projeto
    resources_path = os.path.join(os.path.dirname(__file__), 'resources')

    if not os.path.exists(resources_path):
        os.makedirs(resources_path)
    
    color = ['blue', 'skyblue', 'red', 'yellow', 'purple', 'green', 'orange', 'pink', 'brown', 'gray', 
             'cyan', 'magenta', 'lime', 'teal', 'lavender', 'maroon', 'navy', 'olive', 'coral', 'indigo',
             'turquoise', 'violet', 'tan', 'salmon', 'khaki', 'orchid', 'gold', 'aquamarine', 'steelblue', 'peru']
    
    commit_labels = ["feat Adicionar funcionalidade de login",
                     "fix Corrigir bug na página de perfil",
                     "build Atualizar dependências",
                     "chore Limpar código de testes",
                     "feat Implementar página de registro",
                     "fix Resolver problema de validação de formulário",
                     "build Configurar pipeline de CI/CD",
                     "chore Atualizar documentação",
                     "feat Adicionar opção de trocar idioma",
                     "fix Corrigir erro de digitação no README"]
    
    random_commits_labels = random.choice(commit_labels)
    random_color = random.choice(color)

    # Criar o gráfico de barras
    plt.figure(figsize=(10, 6))
    plt.bar(contribuidores, num_commits, color=random_color)
    plt.xlabel('Colaboradores')
    plt.ylabel('Número de Commits')
    plt.title('Commits de cada colaborador')
    plt.xticks(rotation=45, ha='right')

    # Adicionar os números de commits acima das barras
    for i in range(len(contribuidores)):
        plt.text(i, num_commits[i] + 0.2, str(num_commits[i]), ha='center')

    # Salvar o gráfico como uma imagem no diretório 'resources'
    plt.tight_layout()
    plt.savefig(os.path.join(resources_path, ''.join(random_commits_labels) + '.png'))

# Chamar a função para gerar o gráfico
plot_git_commits()