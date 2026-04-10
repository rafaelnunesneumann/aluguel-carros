package com.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterClienteRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos")
    private String cpf;

    @NotBlank(message = "RG é obrigatório")
    @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
    private String rg;

    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 255, message = "Endereço deve ter no máximo 255 caracteres")
    private String endereco;

    @Size(max = 100, message = "Profissão deve ter no máximo 100 caracteres")
    private String profissao;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ser válido")
    private String email;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;

    @Valid
    @Size(max = 3, message = "Máximo de 3 rendimentos permitidos")
    private List<RendimentoRequest> rendimentos;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String confirmSenha;
}
