package com.chamados.service;

import com.chamados.domain.Usuario;
import com.chamados.dto.request.LoginRequestDTO;
import com.chamados.dto.response.LoginResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService            jwtService;

    /**
     * Autentica o usuário e retorna o token JWT.
     * O Spring Security lança AuthenticationException automaticamente
     * se as credenciais forem inválidas ou o usuário estiver inativo.
     */
    public LoginResponseDTO login(LoginRequestDTO dto) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        Usuario usuario = (Usuario) authentication.getPrincipal();
        String  token   = jwtService.gerarToken(usuario);

        return new LoginResponseDTO(
            token,
            "Bearer",
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getRole().name(),
            jwtService.getExpiracaoMs()
        );
    }
}
