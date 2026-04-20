package com.chamados.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.chamados.domain.Chamado;
import com.chamados.exception.ResourceNotFoundException;
import com.chamados.repository.ChamadoRepository;
import com.chamados.repository.TecnicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private static final DateTimeFormatter FMT_DATA  = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Color COR_CABECALHO          = new Color(30, 64, 175);
    private static final Color COR_LINHA_PAR           = new Color(239, 246, 255);

    private final ChamadoRepository chamadoRepository;
    private final TecnicoRepository tecnicoRepository;

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioPorTecnicoEMes(Long tecnicoId, int mes, int ano) {
        var tecnico = tecnicoRepository.findById(tecnicoId)
            .orElseThrow(() -> new ResourceNotFoundException("Técnico não encontrado com ID: " + tecnicoId));

        List<Chamado> chamados = chamadoRepository
            .findResolvidosByTecnicoAndMesAno(tecnicoId, mes, ano);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 40, 40, 60, 40);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            adicionarCabecalho(doc, tecnico.getNome(), mes, ano);
            adicionarTabelaChamados(doc, chamados);
            adicionarRodape(doc, chamados.size());

            doc.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }

    private void adicionarCabecalho(Document doc, String nomeTecnico,
                                     int mes, int ano) throws DocumentException {
        Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.WHITE);
        Font fontSub    = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.DARK_GRAY);

        PdfPTable header = new PdfPTable(1);
        header.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase("Relatório de Chamados Concluídos", fontTitulo));
        cell.setBackgroundColor(COR_CABECALHO);
        cell.setPadding(12);
        cell.setBorder(Rectangle.NO_BORDER);
        header.addCell(cell);
        doc.add(header);

        doc.add(Chunk.NEWLINE);
        doc.add(new Paragraph("Técnico: " + nomeTecnico, fontSub));
        doc.add(new Paragraph(String.format("Período: %02d/%d", mes, ano), fontSub));
        doc.add(Chunk.NEWLINE);
    }

    private void adicionarTabelaChamados(Document doc,
                                          List<Chamado> chamados) throws DocumentException {
        Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        Font fontCell   = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);

        PdfPTable table = new PdfPTable(new float[]{1f, 2f, 2f, 2f, 4f});
        table.setWidthPercentage(100);

        for (String titulo : List.of("ID", "Unidade", "Município", "Conclusão", "Descrição")) {
            PdfPCell c = new PdfPCell(new Phrase(titulo, fontHeader));
            c.setBackgroundColor(COR_CABECALHO);
            c.setPadding(6);
            c.setBorderColor(Color.WHITE);
            table.addCell(c);
        }

        for (int i = 0; i < chamados.size(); i++) {
            Chamado ch = chamados.get(i);
            Color bg = (i % 2 == 0) ? Color.WHITE : COR_LINHA_PAR;

            adicionarCelula(table, String.valueOf(ch.getId()), fontCell, bg);
            adicionarCelula(table, ch.getUnidade().getNome(), fontCell, bg);
            adicionarCelula(table, ch.getUnidade().getMunicipio().getNome(), fontCell, bg);
            adicionarCelula(table, ch.getDataConclusao().format(FMT_DATA), fontCell, bg);
            adicionarCelula(table, truncar(ch.getDescricao(), 80), fontCell, bg);
        }

        doc.add(table);
    }

    private void adicionarRodape(Document doc, int total) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY);
        doc.add(Chunk.NEWLINE);
        doc.add(new Paragraph("Total de chamados concluídos: " + total, font));
    }

    private void adicionarCelula(PdfPTable table, String texto, Font font, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(5);
        cell.setBorderColor(new Color(200, 200, 200));
        table.addCell(cell);
    }

    private String truncar(String texto, int max) {
        if (texto == null) return "";
        return texto.length() > max ? texto.substring(0, max) + "..." : texto;
    }
}
