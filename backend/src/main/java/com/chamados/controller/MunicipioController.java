package com.chamados.controller;

import com.chamados.dto.request.MunicipioRequestDTO;
import com.chamados.dto.response.MunicipioResponseDTO;
import com.chamados.service.MunicipioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/municipios")
@RequiredArgsConstructor
@Tag(name = "Municípios", description = "Cadastro de municípios")
public class MunicipioController {

    private final MunicipioService municipioService;

    @GetMapping
    @Operation(summary = "Lista todos os municípios")
    public ResponseEntity<List<MunicipioResponseDTO>> listar() {
        return ResponseEntity.ok(municipioService.listar());
    }

    @PostMapping
    @Operation(summary = "Cadastra novo município")
    public ResponseEntity<MunicipioResponseDTO> criar(@Valid @RequestBody MunicipioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(municipioService.criar(dto));
    }
}
