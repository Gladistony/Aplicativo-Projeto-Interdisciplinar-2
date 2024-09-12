<?php
session_start();
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
?>



<link rel="stylesheet" href="../Styles/estilo_tela-de-amigos.css">

<body>
    <header id="barra-superior">

        <!--     <section id="container-pesquisa">
            <input type="text" id="barra-pesquisa" placeholder="Procurar conversas..." name="buscarConversa">
            <button id="botao-pesquisa" name="pesquisar">Pesquisar </button>
        </section> -->
        <section id="container-adicionar-amigo">
            <input type="email" id="novo-amigo" placeholder="E-mail do novo amigo" name="EmailDoAmigo"
                autocomplete="off">
            <button id="botao-adicionar-amigo" name="adicionar">Adicionar</button>
        </section>

    </header>
    <main>
        <section id="amigos">

            ] <a href="./Paginas/menu-perfil-publico.php"><img src=" <?php echo $echo($fotoPerfil); ?>" alt=""
                    id="img-perfil"></a>;
            <section id="informacao">
                <p id="nome"> <?php echo $nomeDoAmigo; ?> </p>
                <p id="mensagem-recente"><?php echo $emailDoUsuario; ?></p>
            </section>

            <a href="**"><button id="exculir" type="button" name="excluir"> Excluir </button></a>

        </section>
    </main>
</body>