## Guia de Deploy para Servidor PHP com XAMPP e Composer

### Passo 1: Instalar o XAMPP
1. **Baixe o XAMPP**: Acesse o site oficial do XAMPP e baixe a versão para Windows.
2. **Instale o XAMPP**: Execute o instalador e siga as instruções. Certifique-se de selecionar os componentes necessários, como Apache, MySQL, PHP e phpMyAdmin.
3. **Inicie o XAMPP**: Após a instalação, abra o painel de controle do XAMPP e inicie o Apache e o MySQL.

### Passo 2: Configurar o PHP no XAMPP
1. **Verifique a instalação do PHP**: Abra o terminal (cmd) e digite `php -v` para verificar se o PHP está instalado corretamente.
2. **Configurar o php.ini**: No diretório de instalação do XAMPP, abra o arquivo `php.ini` (geralmente localizado em `C:\xampp\php\php.ini`) e certifique-se de que as seguintes extensões estejam habilitadas (remova o ponto e vírgula `;` no início das linhas, se necessário):
   ```ini
   extension=php_openssl.dll
   extension=php_curl.dll```
3. **Atenção**: Os passos seguintes somente devem ser executados em um novo projeto, no caso da importação do projeto já configurado, os passos 3,4 e 5 podem ser ignorados

#### Passo 3: Instalar o Composer
1. **Baixe o Composer**: Acesse o site oficial do Composer e baixe o instalador para Windows.
2. **Execute o instalador**: Siga as instruções do instalador. Quando solicitado, selecione o caminho para o `php.exe` (geralmente em `C:\xampp\php\php.exe`).
3. **Verifique a instalação**: Após a instalação, abra o terminal e digite `composer` para verificar se o Composer foi instalado corretamente.

### Passo 4: Configurar o Projeto PHP
1. **Crie um diretório para o projeto**: No diretório `htdocs` do XAMPP (geralmente em `C:\xampp\htdocs`), crie uma pasta para o seu projeto.
2. **Inicie um novo projeto com o Composer**: No terminal, navegue até o diretório do projeto e execute o comando:
   ```bash
   composer init```

### Passo 5: Instalar o Pacote do Firebase
1. **Abra a pasta do projeto**: No terminal, navegue até o diretório do seu projeto.
2. **Instale o pacote do Firebase**: Execute o seguinte comando para instalar o pacote `kreait/firebase-php`:
   ```bash
   composer require "kreait/firebase-php:^7.0" ```
