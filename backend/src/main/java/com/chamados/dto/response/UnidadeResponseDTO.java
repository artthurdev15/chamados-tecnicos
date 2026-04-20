package com.chamados.dto.response;

public record UnidadeResponseDTO(
    Long id,
    String nome,
    MunicipioResponseDTO municipio
) {}
