package com.aluguelcarros.repository;

import com.aluguelcarros.model.Agente;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface AgenteRepository extends JpaRepository<Agente, Long> {

    Optional<Agente> findByLogin(String login);

    boolean existsByLogin(String login);

    boolean existsByCnpj(String cnpj);
}
