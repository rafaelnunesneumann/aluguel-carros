package com.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditoRequest {

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal valor;
}
