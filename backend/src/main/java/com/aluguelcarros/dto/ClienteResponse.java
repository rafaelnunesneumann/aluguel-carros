package com.aluguelcarros.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponse {

    private Long id;
    private String nome;
    private String cpf;
    private String rg;
    private String endereco;
    private String profissao;
    private String email;
    private String telefone;
    private List<RendimentoResponse> rendimentos;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
