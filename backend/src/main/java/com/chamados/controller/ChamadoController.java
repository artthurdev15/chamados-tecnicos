package com.chamados.controller;

import com.chamados.domain.enums.StatusChamado;
import com.chamados.dto.request.ChamadoRequestDTO;
import com.chamados.dto.response.ChamadoResponseDTO;
import com.chamados.service.ChamadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chamados")
@RequiredArgsConstructor
@Tag(name = "Chamados", description = "Abertura, listagem e resolução de chamados técnicos")
public class ChamadoController {

    private final ChamadoService chamadoService;

    @GetMapping
    @Operation(summary = "Lista chamados com filtros opcionais de status e técnico")
    public ResponseEntity<List<ChamadoResponseDTO>> listar(
            @Parameter(description = "Filtrar por status: PENDENTE ou RESOLVIDO")
            @RequestParam(required = false) StatusChamado status,
            @Parameter(description = "Filtrar por ID do técnico")
            @RequestParam(required = false) Long tecnicoId) {
        return ResponseEntity.ok(chamadoService.listar(status, tecnicoId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca chamado por ID")
    public ResponseEntity<ChamadoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(chamadoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Abre novo chamado técnico")
    public ResponseEntity<ChamadoResponseDTO> abrir(@Valid @RequestBody ChamadoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chamadoService.abrir(dto));
    }

    @PatchMapping("/{id}/resolver")
    @Operation(summary = "Resolve o chamado — preenche dataConclusao automaticamente")
    public ResponseEntity<ChamadoResponseDTO> resolver(@PathVariable Long id) {
        return ResponseEntity.ok(chamadoService.resolver(id));
    }
}
