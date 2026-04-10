package com.aluguelcarros.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratoCreditoResponse {
    private Long id;
    private BigDecimal valor;
    private boolean aprovado;
    private Long bancoId;
    private String bancoRazaoSocial;
    private Long pedidoId;
    private LocalDateTime createdAt;
}
