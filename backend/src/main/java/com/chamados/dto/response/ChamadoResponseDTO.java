package com.chamados.dto.response;

import com.chamados.domain.enums.CategoriaChamado;
import com.chamados.domain.enums.StatusChamado;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ChamadoResponseDTO(
    Long id,
    String numeroChamado,
    UnidadeResponseDTO unidade,
    TecnicoResponseDTO tecnico,
    LocalDateTime dataSolicitacao,
    LocalDate dataConclusao,
    CategoriaChamado categoria,
    String descricao,
    StatusChamado status
) {}
