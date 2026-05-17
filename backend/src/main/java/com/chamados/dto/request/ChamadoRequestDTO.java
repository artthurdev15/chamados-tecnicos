package com.chamados.dto.request;

import com.chamados.domain.enums.CategoriaChamado;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChamadoRequestDTO(

        // O campo precisava ser adicionado aqui no início:
        @NotBlank(message = "O número do chamado é obrigatório.")
        String numeroChamado,

        @NotNull(message = "O ID da unidade é obrigatório.")
        Long unidadeId,

        @NotNull(message = "O ID do técnico é obrigatório.")
        Long tecnicoId,

        @NotNull(message = "A categoria é obrigatória.")
        CategoriaChamado categoria,

        @NotBlank(message = "A descrição é obrigatória.")
        @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres.")
        String descricao

) {}