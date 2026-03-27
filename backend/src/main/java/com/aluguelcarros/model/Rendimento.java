package com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "rendimentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Entidade empregadora é obrigatória")
    @Size(max = 150, message = "Entidade empregadora deve ter no máximo 150 caracteres")
    @Column(name = "entidade_empregadora", nullable = false, length = 150)
    private String entidadeEmpregadora;

    @NotNull(message = "Valor do rendimento é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rendimento deve ser maior que zero")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnore
    private Cliente cliente;
}
