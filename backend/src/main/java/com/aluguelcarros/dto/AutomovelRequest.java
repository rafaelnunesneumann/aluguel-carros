package com.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.*;
import lombok.*;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutomovelRequest {

    @NotBlank(message = "Matrícula é obrigatória")
    @Size(max = 20, message = "Matrícula deve ter no máximo 20 caracteres")
    private String matricula;

    @NotNull(message = "Ano é obrigatório")
    @Min(value = 1886, message = "Ano deve ser a partir de 1886")
    @Max(value = 2100, message = "Ano inválido")
    private Integer ano;

    @NotBlank(message = "Marca é obrigatória")
    @Size(max = 100, message = "Marca deve ter no máximo 100 caracteres")
    private String marca;

    @NotBlank(message = "Modelo é obrigatório")
    @Size(max = 100, message = "Modelo deve ter no máximo 100 caracteres")
    private String modelo;

    @NotBlank(message = "Placa é obrigatória")
    @Size(max = 10, message = "Placa deve ter no máximo 10 caracteres")
    private String placa;
}
