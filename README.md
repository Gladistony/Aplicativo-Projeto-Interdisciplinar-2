# Projeto Interdisciplinar 2: 

**Disciplina**: Projeto Interdisciplinar 2 - Engenharia da Computação, UFRPE, Campus UABJ

Este projeto é dedicado à disciplina de Projeto 2 do curso de Engenharia da Computação da UFRPE, Campus UABJ.

[Relatorio da 1 VA - 27/08/2024](https://github.com/Gladistony/Aplicativo-Projeto-Interdisciplinar-2/issues/45)

[Relatorio da 2 VA - 20/09/2024](https://github.com/Gladistony/Aplicativo-Projeto-Interdisciplinar-2/issues/108)

## 🎯 Objetivo do Projeto

O projeto tem como objetivo a criação de um site destinado a centralizar a interação entre estudantes, monitores e professores. Para isso, será criado um fórum dedicado às discussões, apresentação e resolução de atividades, bem como ao compartilhamento geral de informações sobre a disciplina.

Para acessar o site, o aluno deverá fazer login com seu e-mail institucional, o que permitirá o acesso à página de cadastro, onde poderá escolher seu curso e as turmas nas quais está matriculado. O sistema também deve auxiliar o aluno, fornecendo ferramentas para encontrar os materiais necessários para a disciplina ou para tirar dúvidas, utilizando um fórum com os monitores ou outros alunos.

Além disso, deve haver um local onde os alunos possam acessar os materiais da turma atual ou de turmas anteriores, incluindo provas antigas, caso estejam disponíveis.

## 👥 Equipe

- **[Gladistony Silva](https://github.com/Gladistony)** - Desenvolvedor Backend e Frontend
- **[Douglas Bezerra](https://github.com/DouglasBezerra01)** - Desenvolvedor Frontend
- **[Erick Santos](https://github.com/Erickjonatthan)** - Desenvolvedor Backend
- **[Gustavo França ](https://github.com/gustavof0411)** - Desenvolvedor Frontend
- **[José Miguel](https://github.com/JMiguelsilva2003)** - Desenvolvedor Backend e Frontend
- **[Pedro Emmanuel](https://github.com/Pedro-Emmanuel-G-C-Machado)** - Desenvolvedor Frontend
- **[Vinicius Henrykyy](https://github.com/ViniciusHenrykyy)** - Desenvolvedor Frontend

## Orientação

- **Professor**: [Ygor Amaral](https://github.com/ygoramaral)
- **Professor**: [Lucas Silva Figueiredo]

## 🚀 Tecnologias Utilizadas

O projeto está sendo desenvolvido utilizando as seguintes tecnologias:


- **JavaScript**: Para a lógica de interação no frontend e backend.
- **CSS**: Para estilização e layout das páginas.
- **HTML**: Para a estruturação do conteúdo do site.
- **PHP**: Para o desenvolvimento do backend e integração com o banco de dados.
- **SQL**: Para o gerenciamento e manipulação dos dados armazenados.
- **Firebase** Para o gerenciamento e manipulação dos dados armazenados.

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
   extension=php_curl.dll
   ```
3. **Atenção**: Os passos seguintes somente devem ser executados em um novo projeto, no caso da importação do projeto já configurado, os passos 3,4 e 5 podem ser ignorados

#### Passo 3: Instalar o Composer
1. **Baixe o Composer**: Acesse o site oficial do Composer e baixe o instalador para Windows.
2. **Execute o instalador**: Siga as instruções do instalador. Quando solicitado, selecione o caminho para o `php.exe` (geralmente em `C:\xampp\php\php.exe`).
3. **Verifique a instalação**: Após a instalação, abra o terminal e digite `composer` para verificar se o Composer foi instalado corretamente.

### Passo 4: Configurar o Projeto PHP
1. **Crie um diretório para o projeto**: No diretório `htdocs` do XAMPP (geralmente em `C:\xampp\htdocs`), crie uma pasta para o seu projeto.
2. **Inicie um novo projeto com o Composer**: No terminal, navegue até o diretório do projeto e execute o comando:
   ```bash
   composer init
	```
### Passo 5: Instalação de componentes essenciaiais
Para o funcionamento do sistema administrativo, é preciso instalar o php-mbstring em adicional. É possivel fazer isso no ubunto usando o seguinte comando:
   ```
	sudo apt-get install php-mbstring
```
### Passo 6: Instalar o Pacote do Firebase
1. **Abra a pasta do projeto**: No terminal, navegue até o diretório do seu projeto.
2. **Instale o pacote do Firebase**: Execute o seguinte comando para instalar o pacote `kreait/firebase-php`:
   ```bash
   composer require "kreait/firebase-php"
   ```
