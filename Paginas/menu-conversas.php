<section id="conversas">
    <section id="monitores-online"> <!--Futuro sistema de repetição e requisição do banco de dados-->
        <h1>Monitores online agora</h1>
        <div class="container" id="listagemdeMonitores">
        <?php
        $temMonitoresOnline = false;
        foreach ($monitores as $monitor):
            if ($monitor['online']):
                $temMonitoresOnline = true;
                ?>
                <div class="usuarioLogado">
                    <img src="path_to_images/<?php echo $monitor['img']; ?>" alt="<?php echo $monitor['nome']; ?>">
                    <div>
                        <h3><?php echo explode(' ', $monitor['nome'])[0] . ' ' . explode(' ', $monitor['nome'])[1]; ?></h3>
                        <p>Monitor disponível</p>
                    </div>
                </div>
                <?php
            endif;
        endforeach;

        if (!$temMonitoresOnline):
            ?>
            <p>Não há monitores online no momento.</p>
        <?php endif; ?>
    </div>
    </section>

    <section id="professores-online"> <!--Futuro sistema de repetição e requisição do banco de dados-->
        <h1>Professores online agora</h1>
        <div class="container" id="listagemdeProfessores">
            <?php            
            $temProfessoresOnline = false;
            foreach ($professores as $professor):
                if ($professor['online']):
                    $temProfessoresOnline = true;
                    ?>
                    <div class="usuarioLogado">
                        <img src="path_to_images/<?php echo $professor['img']; ?>" alt="<?php echo $professor['nome']; ?>">
                        <div>
                            <h3><?php echo explode(' ', $professor['nome'])[0] . ' ' . explode(' ', $professor['nome'])[1]; ?></h3>
                            <p>Professor disponível</p>
                        </div>
                    </div>
                    <?php
                endif;
            endforeach;

            if (!$temProfessoresOnline):
                ?>
                <p>Não há professores online no momento.</p>
            <?php endif; ?>
        </div>
    </section>

    <section id="amigos-online"> <!--Futuro sistema de repetição e requisição do banco de dados-->
        <h1>Amigos online agora</h1>
        <div class="container" id="listagemdeAmigos">
            <?php            
            $temAmigosOnline = false;
            foreach ($amigos as $amigo):
                if ($amigo['online']):
                    $temAmigosOnline = true;
                    ?>
                    <div class="usuarioLogado">
                        <img src="path_to_images/<?php echo $amigo['img']; ?>" alt="<?php echo $amigo['nome']; ?>">
                        <div>
                            <h3><?php echo explode(' ', $amigo['nome'])[0] . ' ' . explode(' ', $amigo['nome'])[1]; ?></h3>
                            <p>Amigo disponível</p>
                        </div>
                    </div>
                    <?php
                endif;
            endforeach;

            if (!$temAmigosOnline):
                ?>
                <p>Não há amigos online no momento.</p>
            <?php endif; ?>
        </div>
    </section>

    <section id="conversas-recentes"> <!--Futuro sistema de repetição e requisição do banco de dados-->
        <h1><a href="#" id="link-amigos">Amigos</a></h1>
        <div class="container" id="diferente">
            <img src="../Recursos/Imagens/perfil-teste.avif" alt="">
            <div>
                <h2>Nome do Usuário</h2>
                <p>mensagem recente</p>
            </div>
        </div>
    </section>
</section>