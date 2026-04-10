package com.aluguelcarros.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratoResponse {
    private Long id;
    private LocalDate dataAssinatura;
    private String tipo;
    private Long pedidoId;
    private Long automovelId;
    private String automovelMarca;
    private String automovelModelo;
    private String automovelPlaca;
}
