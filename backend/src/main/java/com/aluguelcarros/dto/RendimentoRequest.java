package com.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendimentoRequest {

    @NotBlank(message = "Entidade empregadora é obrigatória")
    @Size(max = 150, message = "Entidade empregadora deve ter no máximo 150 caracteres")
    private String entidadeEmpregadora;

    @NotNull(message = "Valor do rendimento é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rendimento deve ser maior que zero")
    private BigDecimal valor;
}
