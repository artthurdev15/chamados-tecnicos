package com.chamados.controller;

import com.chamados.dto.response.DashboardTecnicoResponseDTO;
import com.chamados.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Resumo mensal de visitas por técnico com alertas de excesso")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/mensal")
    @Operation(summary = "Resumo mensal — alertaExcesso = true quando técnico ultrapassa 10 visitas")
    public ResponseEntity<List<DashboardTecnicoResponseDTO>> resumoMensal(
            @Parameter(description = "Mês (1-12). Default: mês atual.")
            @RequestParam(required = false) Integer mes,
            @Parameter(description = "Ano. Default: ano atual.")
            @RequestParam(required = false) Integer ano) {

        int mesFinal = (mes != null) ? mes : LocalDate.now().getMonthValue();
        int anoFinal = (ano != null) ? ano : LocalDate.now().getYear();

        return ResponseEntity.ok(dashboardService.resumoMensal(mesFinal, anoFinal));
    }
}
