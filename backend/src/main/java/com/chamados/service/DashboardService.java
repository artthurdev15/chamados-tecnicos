package com.chamados.service;

import com.chamados.dto.response.DashboardTecnicoResponseDTO;
import com.chamados.repository.ChamadoRepository;
import com.chamados.repository.TecnicoRepository;
import com.chamados.service.mapper.ChamadoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int LIMITE_VISITAS_ALERTA = 10;

    private final TecnicoRepository tecnicoRepository;
    private final ChamadoRepository chamadoRepository;
    private final ChamadoMapper mapper;

    @Transactional(readOnly = true)
    public List<DashboardTecnicoResponseDTO> resumoMensal(int mes, int ano) {
        return tecnicoRepository.findAllByAtivoTrue()
            .stream()
            .map(tecnico -> {
                int total = chamadoRepository.countResolvidosByTecnicoAndMesAno(
                    tecnico.getId(), mes, ano
                );
                return new DashboardTecnicoResponseDTO(
                    mapper.toTecnicoDTO(tecnico),
                    total,
                    total > LIMITE_VISITAS_ALERTA
                );
            })
            .toList();
    }
}
