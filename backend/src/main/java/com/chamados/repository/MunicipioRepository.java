package com.chamados.repository;

import com.chamados.domain.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MunicipioRepository extends JpaRepository<Municipio, Long> {
    boolean existsByNomeIgnoreCase(String nome);
}
