package com.chamados.controller;

import com.chamados.dto.request.UnidadeRequestDTO;
import com.chamados.dto.response.UnidadeResponseDTO;
import com.chamados.service.UnidadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades")
@RequiredArgsConstructor
@Tag(name = "Unidades", description = "Gerenciamento de unidades de atendimento")
public class UnidadeController {

    private final UnidadeService unidadeService;

    @GetMapping
    @Operation(summary = "Lista todas as unidades")
    public ResponseEntity<List<UnidadeResponseDTO>> listar() {
        return ResponseEntity.ok(unidadeService.listar());
    }

    @GetMapping("/municipio/{municipioId}")
    @Operation(summary = "Lista unidades de um município específico")
    public ResponseEntity<List<UnidadeResponseDTO>> listarPorMunicipio(@PathVariable Long municipioId) {
        return ResponseEntity.ok(unidadeService.listarPorMunicipio(municipioId));
    }

    @PostMapping
    @Operation(summary = "Cadastra nova unidade vinculada a um município")
    public ResponseEntity<UnidadeResponseDTO> criar(@Valid @RequestBody UnidadeRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unidadeService.criar(dto));
    }
}
