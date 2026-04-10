package com.aluguelcarros.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutomovelResponse {

    private Long id;
    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    private String placa;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
