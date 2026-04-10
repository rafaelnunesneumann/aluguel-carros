package com.aluguelcarros.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "contratos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_assinatura", nullable = false)
    private LocalDate dataAssinatura;

    @Column(nullable = false, length = 50)
    private String tipo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;
}
