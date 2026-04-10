package com.aluguelcarros.repository;

import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.model.ClienteStatus;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Page<Cliente> findByStatus(ClienteStatus status, Pageable pageable);

    Optional<Cliente> findByIdAndStatus(Long id, ClienteStatus status);

    Optional<Cliente> findByCpf(String cpf);

    Optional<Cliente> findByCpfAndStatus(String cpf, ClienteStatus status);

    boolean existsByCpfAndStatus(String cpf, ClienteStatus status);

    boolean existsByCpfAndIdNotAndStatus(String cpf, Long id, ClienteStatus status);

    Optional<Cliente> findByLogin(String login);
}
