package com.aluguelcarros.repository;

import com.aluguelcarros.model.Automovel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    boolean existsByMatricula(String matricula);

    boolean existsByPlaca(String placa);

    boolean existsByMatriculaAndIdNot(String matricula, Long id);

    boolean existsByPlacaAndIdNot(String placa, Long id);

    Optional<Automovel> findByMatricula(String matricula);

    Optional<Automovel> findByPlaca(String placa);
}
