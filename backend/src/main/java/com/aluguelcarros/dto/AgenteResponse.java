package com.aluguelcarros.dto;

import com.aluguelcarros.model.TipoAgente;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgenteResponse {
    private Long id;
    private String razaoSocial;
    private String cnpj;
    private String endereco;
    private String login;
    private TipoAgente tipo;
    private LocalDateTime createdAt;
}
