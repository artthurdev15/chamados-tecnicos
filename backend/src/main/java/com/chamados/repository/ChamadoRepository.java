package com.chamados.repository;

import com.chamados.domain.Chamado;
import com.chamados.domain.enums.StatusChamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

    @Query("""
        SELECT c FROM Chamado c
        JOIN FETCH c.tecnico t
        JOIN FETCH c.unidade u
        JOIN FETCH u.municipio
        WHERE (:status IS NULL OR c.status = :status)
          AND (:tecnicoId IS NULL OR t.id = :tecnicoId)
        ORDER BY c.dataSolicitacao DESC
    """)
    List<Chamado> findAllWithFilters(
        @Param("status") StatusChamado status,
        @Param("tecnicoId") Long tecnicoId
    );

    @Query("""
        SELECT c FROM Chamado c
        JOIN FETCH c.tecnico t
        JOIN FETCH c.unidade u
        JOIN FETCH u.municipio
        WHERE c.status = 'RESOLVIDO'
          AND t.id = :tecnicoId
          AND FUNCTION('MONTH', c.dataConclusao) = :mes
          AND FUNCTION('YEAR',  c.dataConclusao) = :ano
        ORDER BY c.dataConclusao ASC
    """)
    List<Chamado> findResolvidosByTecnicoAndMesAno(
        @Param("tecnicoId") Long tecnicoId,
        @Param("mes") int mes,
        @Param("ano") int ano
    );

    @Query("""
        SELECT COUNT(c) FROM Chamado c
        WHERE c.status = 'RESOLVIDO'
          AND c.tecnico.id = :tecnicoId
          AND FUNCTION('MONTH', c.dataConclusao) = :mes
          AND FUNCTION('YEAR',  c.dataConclusao) = :ano
    """)
    int countResolvidosByTecnicoAndMesAno(
        @Param("tecnicoId") Long tecnicoId,
        @Param("mes") int mes,
        @Param("ano") int ano
    );
}
