<link rel="stylesheet" href="../Styles/estilo_tela-de-amigos.css">

<body>
    <header id="barra-superior">

        <!--     <section id="container-pesquisa">
            <input type="text" id="barra-pesquisa" placeholder="Procurar conversas..." name="buscarConversa">
            <button id="botao-pesquisa" name="pesquisar">Pesquisar </button>
        </section> -->
        <section id="container-adicionar-amigo">
            <input type="email" id="novo-amigo" placeholder="E-mail do novo amigo" name="EmailDoAmigo">
            <button id="botao-adicionar-amigo" name="adicionar"> Adicionar </button>
        </section>

    </header>
    <main>
        <section id="amigos">

            <?php echo '<a href="./Paginas/menu-perfil-publico.php"><img src="../Recursos/Imagens/perfil-teste.avif" alt="" id="img-perfil"></a>'; ?>
            <section id="informacao">
                <p id="nome"> Nome do usuário </p>
                <p id="mensagem-recente"> mensagem recente </p>

            </section>

            <a href="**"><button id="exculir" type="button" name="excluir"> Excluir </button></a>

        </section>
    </main>
</body>