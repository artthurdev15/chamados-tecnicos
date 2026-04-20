package com.chamados.service;

import com.chamados.domain.Tecnico;
import com.chamados.dto.request.TecnicoRequestDTO;
import com.chamados.dto.response.TecnicoResponseDTO;
import com.chamados.exception.BusinessException;
import com.chamados.exception.ResourceNotFoundException;
import com.chamados.repository.TecnicoRepository;
import com.chamados.service.mapper.ChamadoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TecnicoService {

    private final TecnicoRepository tecnicoRepository;
    private final ChamadoMapper mapper;

    @Transactional(readOnly = true)
    public List<TecnicoResponseDTO> listarAtivos() {
        return tecnicoRepository.findAllByAtivoTrue()
            .stream().map(mapper::toTecnicoDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<TecnicoResponseDTO> listarTodos() {
        return tecnicoRepository.findAll()
            .stream().map(mapper::toTecnicoDTO).toList();
    }

    @Transactional(readOnly = true)
    public TecnicoResponseDTO buscarPorId(Long id) {
        return mapper.toTecnicoDTO(findOrThrow(id));
    }

    @Transactional
    public TecnicoResponseDTO criar(TecnicoRequestDTO dto) {
        if (tecnicoRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new BusinessException("Já existe um técnico com o nome: " + dto.nome());
        }
        Tecnico tecnico = Tecnico.builder().nome(dto.nome()).build();
        return mapper.toTecnicoDTO(tecnicoRepository.save(tecnico));
    }

    @Transactional
    public TecnicoResponseDTO atualizar(Long id, TecnicoRequestDTO dto) {
        Tecnico tecnico = findOrThrow(id);
        tecnico.setNome(dto.nome());
        return mapper.toTecnicoDTO(tecnicoRepository.save(tecnico));
    }

    @Transactional
    public void desativar(Long id) {
        Tecnico tecnico = findOrThrow(id);
        tecnico.setAtivo(false);
        tecnicoRepository.save(tecnico);
    }

    @Transactional
    public TecnicoResponseDTO reativar(Long id) {
        Tecnico tecnico = findOrThrow(id);
        tecnico.setAtivo(true);
        return mapper.toTecnicoDTO(tecnicoRepository.save(tecnico));
    }

    public Tecnico findOrThrow(Long id) {
        return tecnicoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Técnico não encontrado com ID: " + id));
    }
}
