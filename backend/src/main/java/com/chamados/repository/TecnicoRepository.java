package com.chamados.repository;

import com.chamados.domain.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, Long> {
    List<Tecnico> findAllByAtivoTrue();
    boolean existsByNomeIgnoreCase(String nome);
}
