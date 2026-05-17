package com.chamados.dto.response;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String email,
    String role,
    boolean ativo
) {}
