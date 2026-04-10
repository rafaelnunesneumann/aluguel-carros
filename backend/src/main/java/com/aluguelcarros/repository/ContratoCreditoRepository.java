package com.aluguelcarros.repository;

import com.aluguelcarros.model.ContratoCredito;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {

    Optional<ContratoCredito> findByPedidoId(Long pedidoId);

    List<ContratoCredito> findByBancoId(Long bancoId);
}
