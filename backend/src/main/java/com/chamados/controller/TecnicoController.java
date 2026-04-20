package com.chamados.controller;

import com.chamados.dto.request.TecnicoRequestDTO;
import com.chamados.dto.response.TecnicoResponseDTO;
import com.chamados.service.TecnicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnicos")
@RequiredArgsConstructor
@Tag(name = "Técnicos", description = "Gerenciamento de técnicos (Soft Delete)")
public class TecnicoController {

    private final TecnicoService tecnicoService;

    @GetMapping
    @Operation(summary = "Lista todos os técnicos ativos")
    public ResponseEntity<List<TecnicoResponseDTO>> listarAtivos() {
        return ResponseEntity.ok(tecnicoService.listarAtivos());
    }

    @GetMapping("/todos")
    @Operation(summary = "Lista todos os técnicos (ativos e inativos)")
    public ResponseEntity<List<TecnicoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(tecnicoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca técnico por ID")
    public ResponseEntity<TecnicoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tecnicoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cadastra novo técnico")
    public ResponseEntity<TecnicoResponseDTO> criar(@Valid @RequestBody TecnicoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tecnicoService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza nome do técnico")
    public ResponseEntity<TecnicoResponseDTO> atualizar(
            @PathVariable Long id, @Valid @RequestBody TecnicoRequestDTO dto) {
        return ResponseEntity.ok(tecnicoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desativa técnico (Soft Delete)")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        tecnicoService.desativar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reativar")
    @Operation(summary = "Reativa técnico previamente desativado")
    public ResponseEntity<TecnicoResponseDTO> reativar(@PathVariable Long id) {
        return ResponseEntity.ok(tecnicoService.reativar(id));
    }
}
