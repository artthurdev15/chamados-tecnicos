package com.chamados.config;

import com.chamados.domain.Usuario;
import com.chamados.domain.enums.Role;
import com.chamados.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private static final String ADMIN_EMAIL = "kaue.arthur@admin.com";
    private static final String ADMIN_SENHA = "P@ssw0rd";
    private static final String ADMIN_NOME  = "Kauê Arthur";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepository.existsByEmail(ADMIN_EMAIL)) {
            log.info("Admin padrão já existe — seed ignorado.");
            return;
        }

        Usuario admin = Usuario.builder()
            .nome(ADMIN_NOME)
            .email(ADMIN_EMAIL)
            .senha(passwordEncoder.encode(ADMIN_SENHA))
            .role(Role.ADMINISTRADOR)
            .ativo(true)
            .build();

        usuarioRepository.save(admin);
        log.info("✅ Admin padrão criado: {} ({})", ADMIN_NOME, ADMIN_EMAIL);
    }
}
