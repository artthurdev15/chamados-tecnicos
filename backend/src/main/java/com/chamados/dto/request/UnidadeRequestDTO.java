package com.chamados.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UnidadeRequestDTO(

    @NotBlank(message = "O nome da unidade é obrigatório.")
    @Size(max = 200, message = "O nome deve ter no máximo 200 caracteres.")
    String nome,

    @NotNull(message = "O ID do município é obrigatório.")
    Long municipioId

) {}
