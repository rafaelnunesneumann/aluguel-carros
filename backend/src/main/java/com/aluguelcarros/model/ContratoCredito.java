package com.aluguelcarros.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contratos_credito")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Builder.Default
    @Column(nullable = false)
    private boolean aprovado = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banco_id", nullable = false)
    private Agente banco;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
