package com.chamados.dto.response;

public record DashboardTecnicoResponseDTO(
    TecnicoResponseDTO tecnico,
    int totalVisitasNoMes,
    boolean alertaExcesso
) {}
