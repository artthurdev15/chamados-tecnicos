package com.chamados.controller;

import com.chamados.dto.request.LoginRequestDTO;
import com.chamados.dto.response.LoginResponseDTO;
import com.chamados.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Login e geração de token JWT")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
        summary = "Realiza login e retorna o token JWT",
        description = "Envie e-mail e senha. O token retornado deve ser incluído no header " +
                      "Authorization: Bearer {token} em todas as requisições protegidas."
    )
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
