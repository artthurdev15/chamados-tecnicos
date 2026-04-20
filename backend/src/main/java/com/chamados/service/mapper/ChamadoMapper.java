package com.chamados.service.mapper;

import com.chamados.domain.Chamado;
import com.chamados.domain.Municipio;
import com.chamados.domain.Tecnico;
import com.chamados.domain.Unidade;
import com.chamados.dto.response.ChamadoResponseDTO;
import com.chamados.dto.response.MunicipioResponseDTO;
import com.chamados.dto.response.TecnicoResponseDTO;
import com.chamados.dto.response.UnidadeResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ChamadoMapper {

    public TecnicoResponseDTO toTecnicoDTO(Tecnico t) {
        return new TecnicoResponseDTO(t.getId(), t.getNome(), t.isAtivo());
    }

    public MunicipioResponseDTO toMunicipioDTO(Municipio m) {
        return new MunicipioResponseDTO(m.getId(), m.getNome());
    }

    public UnidadeResponseDTO toUnidadeDTO(Unidade u) {
        return new UnidadeResponseDTO(u.getId(), u.getNome(), toMunicipioDTO(u.getMunicipio()));
    }

    public ChamadoResponseDTO toChamadoDTO(Chamado c) {
        return new ChamadoResponseDTO(
            c.getId(),
            toUnidadeDTO(c.getUnidade()),
            toTecnicoDTO(c.getTecnico()),
            c.getDataSolicitacao(),
            c.getDataConclusao(),
            c.getCategoria(),
            c.getDescricao(),
            c.getStatus()
        );
    }
}
