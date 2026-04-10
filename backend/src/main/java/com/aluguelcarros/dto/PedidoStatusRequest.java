package com.aluguelcarros.dto;

import com.aluguelcarros.model.StatusPedido;
import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoStatusRequest {

    @NotNull(message = "Novo status é obrigatório")
    private StatusPedido novoStatus;
}
