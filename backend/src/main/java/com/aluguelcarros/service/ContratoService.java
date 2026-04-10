package com.aluguelcarros.service;

import com.aluguelcarros.dto.ContratoCreditoResponse;
import com.aluguelcarros.dto.ContratoResponse;
import com.aluguelcarros.exception.BusinessException;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.model.Agente;
import com.aluguelcarros.model.Contrato;
import com.aluguelcarros.model.ContratoCredito;
import com.aluguelcarros.model.Pedido;
import com.aluguelcarros.repository.AgenteRepository;
import com.aluguelcarros.repository.ContratoCreditoRepository;
import com.aluguelcarros.repository.ContratoRepository;
import com.aluguelcarros.repository.PedidoRepository;
import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;

import java.math.BigDecimal;
import java.time.LocalDate;

@Singleton
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final ContratoCreditoRepository contratoCreditoRepository;
    private final PedidoRepository pedidoRepository;
    private final AgenteRepository agenteRepository;

    public ContratoService(ContratoRepository contratoRepository,
                           ContratoCreditoRepository contratoCreditoRepository,
                           PedidoRepository pedidoRepository,
                           AgenteRepository agenteRepository) {
        this.contratoRepository = contratoRepository;
        this.contratoCreditoRepository = contratoCreditoRepository;
        this.pedidoRepository = pedidoRepository;
        this.agenteRepository = agenteRepository;
    }

    @Transactional
    public Contrato gerarContrato(Pedido pedido) {
        contratoRepository.findByPedidoId(pedido.getId()).ifPresent(c -> {
            throw new BusinessException("Contrato já existe para o pedido id: " + pedido.getId());
        });
        Contrato contrato = Contrato.builder()
                .dataAssinatura(LocalDate.now())
                .tipo("ALUGUEL")
                .pedido(pedido)
                .automovel(pedido.getAutomovel())
                .build();
        return contratoRepository.save(contrato);
    }

    @Transactional(readOnly = true)
    public ContratoResponse buscarPorPedidoId(Long pedidoId) {
        Contrato contrato = contratoRepository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato não encontrado para pedido id: " + pedidoId));
        return toContratoResponse(contrato);
    }

    @Transactional
    public ContratoCreditoResponse concederCredito(Long pedidoId, Long bancoId, BigDecimal valor) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + pedidoId));
        Agente banco = agenteRepository.findById(bancoId)
                .orElseThrow(() -> new ResourceNotFoundException("Agente banco não encontrado com id: " + bancoId));

        contratoCreditoRepository.findByPedidoId(pedidoId).ifPresent(c -> {
            throw new BusinessException("Crédito já concedido para o pedido id: " + pedidoId);
        });

        ContratoCredito credito = ContratoCredito.builder()
                .valor(valor)
                .aprovado(true)
                .banco(banco)
                .pedido(pedido)
                .build();
        return toCreditoResponse(contratoCreditoRepository.save(credito));
    }

    @Transactional(readOnly = true)
    public ContratoCreditoResponse buscarCreditoPorPedidoId(Long pedidoId) {
        ContratoCredito credito = contratoCreditoRepository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Crédito não encontrado para pedido id: " + pedidoId));
        return toCreditoResponse(credito);
    }

    private ContratoResponse toContratoResponse(Contrato c) {
        return ContratoResponse.builder()
                .id(c.getId())
                .dataAssinatura(c.getDataAssinatura())
                .tipo(c.getTipo())
                .pedidoId(c.getPedido().getId())
                .automovelId(c.getAutomovel().getId())
                .automovelMarca(c.getAutomovel().getMarca())
                .automovelModelo(c.getAutomovel().getModelo())
                .automovelPlaca(c.getAutomovel().getPlaca())
                .build();
    }

    private ContratoCreditoResponse toCreditoResponse(ContratoCredito c) {
        return ContratoCreditoResponse.builder()
                .id(c.getId())
                .valor(c.getValor())
                .aprovado(c.isAprovado())
                .bancoId(c.getBanco().getId())
                .bancoRazaoSocial(c.getBanco().getRazaoSocial())
                .pedidoId(c.getPedido().getId())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
