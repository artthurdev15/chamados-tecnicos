package com.chamados.repository;

import com.chamados.domain.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

    @Query("SELECT u FROM Unidade u JOIN FETCH u.municipio WHERE u.municipio.id = :municipioId")
    List<Unidade> findAllByMunicipioId(@Param("municipioId") Long municipioId);
}
