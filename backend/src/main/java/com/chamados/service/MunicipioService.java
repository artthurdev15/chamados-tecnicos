package com.chamados.service;

import com.chamados.domain.Municipio;
import com.chamados.dto.request.MunicipioRequestDTO;
import com.chamados.dto.response.MunicipioResponseDTO;
import com.chamados.exception.BusinessException;
import com.chamados.exception.ResourceNotFoundException;
import com.chamados.repository.MunicipioRepository;
import com.chamados.service.mapper.ChamadoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MunicipioService {

    private final MunicipioRepository municipioRepository;
    private final ChamadoMapper mapper;

    @Transactional(readOnly = true)
    public List<MunicipioResponseDTO> listar() {
        return municipioRepository.findAll()
            .stream().map(mapper::toMunicipioDTO).toList();
    }

    @Transactional
    public MunicipioResponseDTO criar(MunicipioRequestDTO dto) {
        if (municipioRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new BusinessException("Município já cadastrado: " + dto.nome());
        }
        Municipio municipio = Municipio.builder().nome(dto.nome()).build();
        return mapper.toMunicipioDTO(municipioRepository.save(municipio));
    }

    public Municipio findOrThrow(Long id) {
        return municipioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Município não encontrado com ID: " + id));
    }
}
