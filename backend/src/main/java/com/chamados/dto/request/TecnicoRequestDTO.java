package com.chamados.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TecnicoRequestDTO(

    @NotBlank(message = "O nome do técnico é obrigatório.")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres.")
    String nome

) {}
