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

import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final ContratoService contratoService;

    public PedidoService(PedidoRepository pedidoRepository,
                         ClienteRepository clienteRepository,
                         AutomovelRepository automovelRepository,
                         ContratoService contratoService) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
        this.contratoService = contratoService;
    }

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

    @Transactional
    public PedidoResponse alterarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));

        StatusPedido atual = pedido.getStatus();
        // Transitions allowed for agents: CRIADO → EM_ANALISE, EM_ANALISE → APROVADO/REPROVADO
        boolean valido = (atual == StatusPedido.CRIADO && novoStatus == StatusPedido.EM_ANALISE)
                || (atual == StatusPedido.EM_ANALISE && (novoStatus == StatusPedido.APROVADO || novoStatus == StatusPedido.REPROVADO));
        if (!valido) {
            throw new BusinessException("Transição de status inválida: " + atual + " → " + novoStatus);
        }

        pedido.setStatus(novoStatus);
        pedido = pedidoRepository.save(pedido);

        if (novoStatus == StatusPedido.APROVADO) {
            contratoService.gerarContrato(pedido);
        }

        return toResponse(pedido);
    }

    @Transactional
    public PedidoResponse modificar(Long id, Long automovelId, Long userId, String userType) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));

        if ("CLIENTE".equals(userType)) {
            if (!pedido.getCliente().getId().equals(userId)) {
                throw new BusinessException("Acesso negado: pedido não pertence ao cliente");
            }
            if (pedido.getStatus() != StatusPedido.CRIADO) {
                throw new BusinessException("Cliente só pode modificar pedidos com status CRIADO");
            }
        } else {
            // EMPRESA or BANCO
            if (pedido.getStatus() != StatusPedido.CRIADO && pedido.getStatus() != StatusPedido.EM_ANALISE) {
                throw new BusinessException("Agente só pode modificar pedidos com status CRIADO ou EM_ANALISE");
            }
        }

        Automovel automovel = automovelRepository.findById(automovelId)
                .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado com id: " + automovelId));

        List<StatusPedido> ativos = List.of(StatusPedido.CRIADO, StatusPedido.EM_ANALISE);
        if (!automovel.getId().equals(pedido.getAutomovel().getId())
                && pedidoRepository.existsByAutomovelIdAndStatusIn(automovel.getId(), ativos)) {
            throw new BusinessException("O automóvel selecionado já possui um pedido ativo e não está disponível.");
        }

        pedido.setAutomovel(automovel);
        return toResponse(pedidoRepository.save(pedido));
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
