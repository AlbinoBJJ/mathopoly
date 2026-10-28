import os

# Pastas que devem ser ignoradas na varredura
EXCLUDED_DIRS = {
    'node_modules', '.git', 'venv', 'env', '__pycache__', 
    'dist', 'build', '.next', '.vscode', '.idea', 'coverage'
}

# Extensões de arquivos binários ou pesados que não contêm código de texto útil
EXCLUDED_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
    '.mp4', '.mp3', '.pdf', '.zip', '.tar', '.gz', '.lock',
    '.pyc', '.exe', '.bin', '.woff', '.woff2', '.ttf', '.eot'
}

# Arquivos específicos a serem ignorados
EXCLUDED_FILES = {
    '.env', '.env.local', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
}

def generate_project_audit(output_filename="audit_projeto.txt"):
    root_dir = os.getcwd()
    print(f"Iniciando varredura no diretório: {root_dir}")
    
    file_count = 0
    
    with open(output_filename, 'w', encoding='utf-8') as out_f:
        out_f.write(f"=== AUDITORIA COMPLETA DO PROJETO ===\n")
        out_f.write(f"Diretório raiz: {root_dir}\n\n" + "="*70 + "\n\n")
        
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Modifica 'dirnames' in-place para impedir que o os.walk entre em pastas excluídas
            dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS and not d.startswith('.')]
            
            for file in filenames:
                if file in EXCLUDED_FILES or file == output_filename:
                    continue
                
                _, ext = os.path.splitext(file)
                if ext.lower() in EXCLUDED_EXTENSIONS:
                    continue
                    
                file_path = os.path.join(dirpath, file)
                relative_path = os.path.relpath(file_path, root_dir)
                
                print(f"Processando: {relative_path}")
                
                out_f.write(f"--- CAMINHO DO ARQUIVO: {relative_path} ---\n")
                out_f.write("Conteúdo:\n")
                out_f.write("-" * 40 + "\n")
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        out_f.write(content)
                except Exception as e:
                    out_f.write(f"[Erro ao ler o arquivo: {e}]\n")
                    
                out_f.write("\n" + "="*70 + "\n\n")
                file_count += 1
                
    print(f"\nAuditoria concluída com sucesso! {file_count} arquivos processados.")
    print(f"Arquivo gerado na raiz: {output_filename}")

if __name__ == "__main__":
    generate_project_audit()