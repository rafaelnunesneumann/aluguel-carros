package com.aluguelcarros.dto;

import com.aluguelcarros.model.TipoAgente;
import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.*;
import lombok.*;

@Introspected
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgenteRequest {

    @NotBlank(message = "Razão social é obrigatória")
    @Size(max = 200, message = "Razão social deve ter no máximo 200 caracteres")
    private String razaoSocial;

    @NotBlank(message = "CNPJ é obrigatório")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter 14 dígitos numéricos")
    private String cnpj;

    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 255)
    private String endereco;

    @NotBlank(message = "Login é obrigatório")
    @Email(message = "Login deve ser um e-mail válido")
    private String login;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String confirmSenha;

    @NotNull(message = "Tipo é obrigatório")
    private TipoAgente tipo;
}
