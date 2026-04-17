package com.aluguelcarros.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "automoveis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Matrícula é obrigatória")
    @Size(max = 20, message = "Matrícula deve ter no máximo 20 caracteres")
    @Column(nullable = false, unique = true, length = 20)
    private String matricula;

    @NotNull(message = "Ano é obrigatório")
    @Min(value = 1886, message = "Ano deve ser a partir de 1886")
    @Max(value = 2100, message = "Ano inválido")
    @Column(nullable = false)
    private Integer ano;

    @NotBlank(message = "Marca é obrigatória")
    @Size(max = 100, message = "Marca deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String marca;

    @NotBlank(message = "Modelo é obrigatório")
    @Size(max = 100, message = "Modelo deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String modelo;

    @NotBlank(message = "Placa é obrigatória")
    @Size(max = 10, message = "Placa deve ter no máximo 10 caracteres")
    @Column(nullable = false, unique = true, length = 10)
    private String placa;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN NOT NULL DEFAULT TRUE")
    private boolean ativo = true;

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
