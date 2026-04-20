package com.chamados.controller;

import com.chamados.service.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
@Tag(name = "Relatórios", description = "Geração de relatórios PDF de chamados concluídos")
public class RelatorioController {

    private final RelatorioService relatorioService;

    @GetMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Download do relatório PDF por técnico e mês")
    public ResponseEntity<byte[]> downloadPdf(
            @Parameter(description = "ID do técnico", required = true)
            @RequestParam Long tecnicoId,
            @Parameter(description = "Mês (1-12). Default: mês atual.")
            @RequestParam(required = false) Integer mes,
            @Parameter(description = "Ano. Default: ano atual.")
            @RequestParam(required = false) Integer ano) {

        int mesFinal = (mes != null) ? mes : LocalDate.now().getMonthValue();
        int anoFinal = (ano != null) ? ano : LocalDate.now().getYear();

        byte[] pdf = relatorioService.gerarRelatorioPorTecnicoEMes(tecnicoId, mesFinal, anoFinal);

        String filename = String.format(
            "relatorio_tecnico_%d_%02d_%d.pdf", tecnicoId, mesFinal, anoFinal
        );

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(pdf.length)
            .body(pdf);
    }
}
