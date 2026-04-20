package com.chamados.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Sistema de Gerenciamento de Chamados Técnicos")
                .description("""
                    API REST para abertura, acompanhamento e resolução de chamados técnicos.

                    **Regras principais:**
                    - Relatórios e dashboard usam `dataConclusao` como referência temporal.
                    - Ao resolver um chamado, `dataConclusao` é preenchida automaticamente.
                    - Técnicos com mais de 10 visitas/mês recebem `alertaExcesso = true`.
                    - Técnicos são desativados via Soft Delete (histórico preservado).
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("Equipe de Desenvolvimento")
                    .email("dev@chamados.com"))
                .license(new License().name("MIT License")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Ambiente local")
            ));
    }
}
