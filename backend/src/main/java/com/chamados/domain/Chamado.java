package com.chamados.domain;

import com.chamados.domain.enums.CategoriaChamado;
import com.chamados.domain.enums.StatusChamado;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chamados", indexes = {
        @Index(name = "idx_chamado_tecnico",       columnList = "tecnico_id"),
        @Index(name = "idx_chamado_status",         columnList = "status"),
        @Index(name = "idx_chamado_data_conclusao", columnList = "data_conclusao")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Chamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_chamado", nullable = false, unique = true, length = 50)
    private String numeroChamado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private Tecnico tecnico;

    @Column(name = "data_solicitacao", nullable = false, updatable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CategoriaChamado categoria;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatusChamado status = StatusChamado.PENDENTE;

    public void concluir(LocalDate dataConclusao) {
        this.status = StatusChamado.RESOLVIDO;
        this.dataConclusao = dataConclusao;
    }
}