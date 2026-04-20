package com.chamados.service;

import com.chamados.domain.Chamado;
import com.chamados.domain.enums.StatusChamado;
import com.chamados.dto.request.ChamadoRequestDTO;
import com.chamados.dto.response.ChamadoResponseDTO;
import com.chamados.exception.BusinessException;
import com.chamados.exception.ResourceNotFoundException;
import com.chamados.repository.ChamadoRepository;
import com.chamados.service.mapper.ChamadoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;
    private final TecnicoService tecnicoService;
    private final UnidadeService unidadeService;
    private final ChamadoMapper mapper;

    @Transactional(readOnly = true)
    public List<ChamadoResponseDTO> listar(StatusChamado status, Long tecnicoId) {
        return chamadoRepository.findAllWithFilters(status, tecnicoId)
            .stream().map(mapper::toChamadoDTO).toList();
    }

    @Transactional(readOnly = true)
    public ChamadoResponseDTO buscarPorId(Long id) {
        return mapper.toChamadoDTO(findOrThrow(id));
    }

    @Transactional
    public ChamadoResponseDTO abrir(ChamadoRequestDTO dto) {
        var tecnico = tecnicoService.findOrThrow(dto.tecnicoId());
        var unidade = unidadeService.findOrThrow(dto.unidadeId());

        if (!tecnico.isAtivo()) {
            throw new BusinessException("Não é possível atribuir chamado a um técnico inativo.");
        }

        Chamado chamado = Chamado.builder()
            .tecnico(tecnico)
            .unidade(unidade)
            .categoria(dto.categoria())
            .descricao(dto.descricao())
            .dataSolicitacao(LocalDateTime.now())
            .build();

        return mapper.toChamadoDTO(chamadoRepository.save(chamado));
    }

    @Transactional
    public ChamadoResponseDTO resolver(Long id) {
        Chamado chamado = findOrThrow(id);

        if (chamado.getStatus() == StatusChamado.RESOLVIDO) {
            throw new BusinessException("O chamado já está resolvido.");
        }

        chamado.concluir(LocalDate.now());
        return mapper.toChamadoDTO(chamadoRepository.save(chamado));
    }

    public Chamado findOrThrow(Long id) {
        return chamadoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado com ID: " + id));
    }
}
