package com.aluguelcarros.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendimentoResponse {

    private Long id;
    private String entidadeEmpregadora;
    private BigDecimal valor;
}
