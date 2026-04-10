package com.aluguelcarros.repository;

import com.aluguelcarros.model.Pedido;
import com.aluguelcarros.model.StatusPedido;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteId(Long clienteId);

    Page<Pedido> findAll(Pageable pageable);

    boolean existsByAutomovelIdAndStatusIn(Long automovelId, List<StatusPedido> statuses);
}
