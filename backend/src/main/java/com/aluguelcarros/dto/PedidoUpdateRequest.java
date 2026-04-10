package com.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoUpdateRequest {

    @NotNull(message = "ID do automóvel é obrigatório")
    private Long automovelId;
}
