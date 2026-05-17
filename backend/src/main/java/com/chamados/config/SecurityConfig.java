package com.chamados.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService      userDetailsService;

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    // ── Rotas públicas ───────────────────────────────────────
    private static final String[] PUBLIC_ROUTES = {
            "/api/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
    };

    // ── Rotas exclusivas do ADMINISTRADOR ────────────────────
    private static final String[] ADMIN_ONLY = {
            "/api/relatorios/**",
            "/api/usuarios/**",
            "/api/tecnicos/**",
            "/api/municipios/**",
            "/api/unidades/**",
            "/api/dashboard/**",
    };

    // Adicionamos o AuthenticationProvider como parâmetro aqui para o Spring injetar sozinho
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authProvider) throws Exception {
        http
                // 1. CSRF desabilitado — API stateless com JWT não precisa
                .csrf(AbstractHttpConfigurer::disable)

                // 2. CORS estrito — origens vindas do application.properties
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Sem sessão — 100% stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Regras de autorização por rota (RBAC)
                .authorizeHttpRequests(auth -> auth

                        // Rotas públicas — login e docs
                        .requestMatchers(PUBLIC_ROUTES).permitAll()

                        // Apenas ADMINISTRADOR
                        .requestMatchers(ADMIN_ONLY).hasRole("ADMINISTRADOR")

                        // TÉCNICO pode abrir e resolver chamados
                        .requestMatchers(HttpMethod.POST,  "/api/chamados").hasAnyRole("ADMINISTRADOR", "TECNICO")
                        .requestMatchers(HttpMethod.PATCH,  "/api/chamados/*/resolver").hasAnyRole("ADMINISTRADOR", "TECNICO")
                        .requestMatchers(HttpMethod.GET,    "/api/chamados/**").hasAnyRole("ADMINISTRADOR", "TECNICO")

                        // Qualquer outra rota não mapeada exige autenticação
                        .anyRequest().authenticated()
                )

                // 5. Provider de autenticação customizado (usando a variável injetada)
                .authenticationProvider(authProvider)

                // 6. Filtro JWT antes do filtro padrão do Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ── CORS estrito (produção) ──────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    // ── Beans de autenticação ────────────────────────────────

    @Bean
    public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}