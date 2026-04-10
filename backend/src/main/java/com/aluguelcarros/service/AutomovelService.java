package com.aluguelcarros.service;

import com.aluguelcarros.dto.AutomovelRequest;
import com.aluguelcarros.dto.AutomovelResponse;
import com.aluguelcarros.exception.BusinessException;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.model.StatusPedido;
import com.aluguelcarros.repository.AutomovelRepository;
import com.aluguelcarros.repository.PedidoRepository;
import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final PedidoRepository pedidoRepository;

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listarTodos() {
        return automovelRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listarDisponiveis() {
        List<StatusPedido> ativos = List.of(StatusPedido.CRIADO, StatusPedido.EM_ANALISE);
        return automovelRepository.findAll().stream()
                .filter(a -> !pedidoRepository.existsByAutomovelIdAndStatusIn(a.getId(), ativos))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AutomovelResponse buscarPorId(Long id) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado com id: " + id));
        return toResponse(automovel);
    }

    @Transactional
    public AutomovelResponse criar(AutomovelRequest request) {
        if (automovelRepository.existsByMatricula(request.getMatricula())) {
            throw new BusinessException("Já existe um automóvel com a matrícula: " + request.getMatricula());
        }
        if (automovelRepository.existsByPlaca(request.getPlaca())) {
            throw new BusinessException("Já existe um automóvel com a placa: " + request.getPlaca());
        }

        Automovel automovel = toEntity(request);
        automovel = automovelRepository.save(automovel);
        return toResponse(automovel);
    }

    @Transactional
    public AutomovelResponse atualizar(Long id, AutomovelRequest request) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado com id: " + id));

        if (automovelRepository.existsByMatriculaAndIdNot(request.getMatricula(), id)) {
            throw new BusinessException("Já existe outro automóvel com a matrícula: " + request.getMatricula());
        }
        if (automovelRepository.existsByPlacaAndIdNot(request.getPlaca(), id)) {
            throw new BusinessException("Já existe outro automóvel com a placa: " + request.getPlaca());
        }

        automovel.setMatricula(request.getMatricula());
        automovel.setAno(request.getAno());
        automovel.setMarca(request.getMarca());
        automovel.setModelo(request.getModelo());
        automovel.setPlaca(request.getPlaca());

        automovel = automovelRepository.save(automovel);
        return toResponse(automovel);
    }

    @Transactional
    public void deletar(Long id) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado com id: " + id));

        List<StatusPedido> ativos = List.of(StatusPedido.CRIADO, StatusPedido.EM_ANALISE);
        if (pedidoRepository.existsByAutomovelIdAndStatusIn(id, ativos)) {
            throw new BusinessException("Não é possível excluir o automóvel pois possui pedido(s) ativo(s).");
        }

        automovelRepository.deleteById(automovel.getId());
    }

    // ---- Mapeamento ----

    private Automovel toEntity(AutomovelRequest request) {
        return Automovel.builder()
                .matricula(request.getMatricula())
                .ano(request.getAno())
                .marca(request.getMarca())
                .modelo(request.getModelo())
                .placa(request.getPlaca())
                .build();
    }

    public AutomovelResponse toResponse(Automovel automovel) {
        return AutomovelResponse.builder()
                .id(automovel.getId())
                .matricula(automovel.getMatricula())
                .ano(automovel.getAno())
                .marca(automovel.getMarca())
                .modelo(automovel.getModelo())
                .placa(automovel.getPlaca())
                .createdAt(automovel.getCreatedAt())
                .updatedAt(automovel.getUpdatedAt())
                .build();
    }
}
