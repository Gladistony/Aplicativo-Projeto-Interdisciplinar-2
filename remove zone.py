import os

def listar_arquivos_zone_identifier(caminho='.'):
    arquivos_zone_identifier = []
    for root, dirs, files in os.walk(caminho):
        for file in files:
            if 'Zone.Identifier' in file:
                arquivos_zone_identifier.append(os.path.join(root, file))
    return arquivos_zone_identifier

def excluir_arquivos(arquivos):
    for arquivo in arquivos:
        os.remove(arquivo)
    print("Arquivos excluídos com sucesso!")

def main():
    arquivos_zone_identifier = listar_arquivos_zone_identifier()
    if arquivos_zone_identifier:
        print("Arquivos encontrados:")
        for arquivo in arquivos_zone_identifier:
            print(arquivo)
        
        resposta = input("Deseja excluir todos esses arquivos? (s/n): ")
        if resposta.lower() == 's':
            excluir_arquivos(arquivos_zone_identifier)
        else:
            print("Nenhum arquivo foi excluído.")
    else:
        print("Nenhum arquivo 'Zone.Identifier' encontrado.")

if __name__ == "__main__":
    main()
