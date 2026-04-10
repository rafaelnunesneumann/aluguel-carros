package com.aluguelcarros.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "agentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Login é obrigatório")
    @Email(message = "Login deve ser um e-mail válido")
    @Column(nullable = false, unique = true, length = 150)
    private String login;

    @NotBlank(message = "Senha é obrigatória")
    @Column(nullable = false)
    private String senha;

    @NotBlank(message = "Razão social é obrigatória")
    @Size(max = 200, message = "Razão social deve ter no máximo 200 caracteres")
    @Column(name = "razao_social", nullable = false, length = 200)
    private String razaoSocial;

    @NotBlank(message = "CNPJ é obrigatório")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter 14 dígitos numéricos")
    @Column(nullable = false, unique = true, length = 14)
    private String cnpj;

    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 255)
    @Column(nullable = false)
    private String endereco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoAgente tipo;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
