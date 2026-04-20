package com.chamados.service;

import com.chamados.domain.Unidade;
import com.chamados.dto.request.UnidadeRequestDTO;
import com.chamados.dto.response.UnidadeResponseDTO;
import com.chamados.exception.ResourceNotFoundException;
import com.chamados.repository.UnidadeRepository;
import com.chamados.service.mapper.ChamadoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;
    private final MunicipioService municipioService;
    private final ChamadoMapper mapper;

    @Transactional(readOnly = true)
    public List<UnidadeResponseDTO> listar() {
        return unidadeRepository.findAll()
            .stream().map(mapper::toUnidadeDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<UnidadeResponseDTO> listarPorMunicipio(Long municipioId) {
        return unidadeRepository.findAllByMunicipioId(municipioId)
            .stream().map(mapper::toUnidadeDTO).toList();
    }

    @Transactional
    public UnidadeResponseDTO criar(UnidadeRequestDTO dto) {
        var municipio = municipioService.findOrThrow(dto.municipioId());
        Unidade unidade = Unidade.builder()
            .nome(dto.nome())
            .municipio(municipio)
            .build();
        return mapper.toUnidadeDTO(unidadeRepository.save(unidade));
    }

    public Unidade findOrThrow(Long id) {
        return unidadeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada com ID: " + id));
    }
}
