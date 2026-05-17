package com.chamados.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Sistema de Gerenciamento de Chamados Técnicos")
                .description("""
                    API REST protegida por JWT.
                    
                    **Como autenticar:**
                    1. Use `POST /api/auth/login` com seu e-mail e senha.
                    2. Copie o campo `token` da resposta.
                    3. Clique no botão **Authorize** acima e cole: `Bearer {token}`.
                    
                    **Perfis:**
                    - `ADMINISTRADOR` — acesso total.
                    - `TECNICO` — apenas abertura e resolução de chamados.
                    """)
                .version("2.0.0")
                .contact(new Contact()
                    .name("Equipe de Desenvolvimento")
                    .email("dev@chamados.com"))
                .license(new License().name("MIT License")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Ambiente local"),
                new Server().url("https://api.chamados.com").description("Produção")
            ))
            .components(new Components()
                .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                    .name(BEARER_AUTH)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Informe o token JWT obtido em /api/auth/login")
                )
            )
            .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
    }
}