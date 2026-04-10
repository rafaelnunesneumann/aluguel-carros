package com.aluguelcarros.dto;

import com.aluguelcarros.model.StatusPedido;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponse {

    private Long id;
    private LocalDate dataCriacao;
    private StatusPedido status;
    private LocalDateTime dataAtualizacao;

    // Cliente info
    private Long clienteId;
    private String clienteNome;
    private String clienteCpf;

    // Automóvel info
    private Long automovelId;
    private String automovelMarca;
    private String automovelModelo;
    private String automovelPlaca;
    private Integer automovelAno;
    private String automovelMatricula;
}
