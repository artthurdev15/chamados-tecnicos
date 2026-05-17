package com.chamados.dto.response;

public record LoginResponseDTO(
    String token,
    String tipo,
    String nome,
    String email,
    String role,
    long expiresIn
) {}
