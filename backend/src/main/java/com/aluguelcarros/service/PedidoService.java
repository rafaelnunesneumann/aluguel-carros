package com.aluguelcarros.service;

import com.aluguelcarros.dto.PedidoRequest;
import com.aluguelcarros.dto.PedidoResponse;
import com.aluguelcarros.exception.BusinessException;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.model.*;
import com.aluguelcarros.repository.AutomovelRepository;
import com.aluguelcarros.repository.ClienteRepository;
import com.aluguelcarros.repository.PedidoRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    @Transactional
    public PedidoResponse criar(PedidoRequest request) {
        Cliente cliente = clienteRepository.findByIdAndStatus(request.getClienteId(), ClienteStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + request.getClienteId()));

        Automovel automovel = automovelRepository.findById(request.getAutomovelId())
                .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado com id: " + request.getAutomovelId()));

        List<StatusPedido> ativos = List.of(StatusPedido.CRIADO, StatusPedido.EM_ANALISE);
        if (pedidoRepository.existsByAutomovelIdAndStatusIn(automovel.getId(), ativos)) {
            throw new BusinessException("O automóvel selecionado já possui um pedido ativo e não está disponível.");
        }

        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .automovel(automovel)
                .status(StatusPedido.CRIADO)
                .build();

        pedido = pedidoRepository.save(pedido);
        return toResponse(pedido);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponse> listarTodos(Pageable pageable) {
        return pedidoRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));
        return toResponse(pedido);
    }

    @Transactional
    public PedidoResponse cancelar(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));

        if (pedido.getStatus() != StatusPedido.CRIADO && pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new BusinessException("Somente pedidos com status CRIADO ou EM_ANALISE podem ser cancelados.");
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        pedido = pedidoRepository.save(pedido);
        return toResponse(pedido);
    }

    // ---- Mapeamento ----

    public PedidoResponse toResponse(Pedido pedido) {
        return PedidoResponse.builder()
                .id(pedido.getId())
                .dataCriacao(pedido.getDataCriacao())
                .status(pedido.getStatus())
                .dataAtualizacao(pedido.getDataAtualizacao())
                .clienteId(pedido.getCliente().getId())
                .clienteNome(pedido.getCliente().getNome())
                .clienteCpf(pedido.getCliente().getCpf())
                .automovelId(pedido.getAutomovel().getId())
                .automovelMarca(pedido.getAutomovel().getMarca())
                .automovelModelo(pedido.getAutomovel().getModelo())
                .automovelPlaca(pedido.getAutomovel().getPlaca())
                .automovelAno(pedido.getAutomovel().getAno())
                .automovelMatricula(pedido.getAutomovel().getMatricula())
                .build();
    }
}
