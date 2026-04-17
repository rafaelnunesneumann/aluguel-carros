package com.aluguelcarros.repository;

import com.aluguelcarros.model.Contrato;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    Optional<Contrato> findByPedidoId(Long pedidoId);

    boolean existsByAutomovelId(Long automovelId);

    boolean existsByPedidoClienteId(Long clienteId);
}
