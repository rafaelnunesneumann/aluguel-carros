package com.aluguelcarros.controller;

import com.aluguelcarros.dto.ContratoCreditoResponse;
import com.aluguelcarros.dto.ContratoResponse;
import com.aluguelcarros.service.ContratoService;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

@Controller("/contratos")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @Get("/pedido/{pedidoId}")
    public ContratoResponse buscarPorPedidoId(Long pedidoId) {
        return contratoService.buscarPorPedidoId(pedidoId);
    }

    @Get("/pedido/{pedidoId}/credito")
    public ContratoCreditoResponse buscarCreditoPorPedidoId(Long pedidoId) {
        return contratoService.buscarCreditoPorPedidoId(pedidoId);
    }
}
