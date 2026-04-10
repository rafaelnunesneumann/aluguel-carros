package com.aluguelcarros.controller;

import com.aluguelcarros.dto.*;
import com.aluguelcarros.service.ContratoService;
import com.aluguelcarros.service.PedidoService;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Controller("/pedidos")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class PedidoController {

    private final PedidoService pedidoService;
    private final ContratoService contratoService;

    public PedidoController(PedidoService pedidoService, ContratoService contratoService) {
        this.pedidoService = pedidoService;
        this.contratoService = contratoService;
    }

    @Get
    @Secured({"ROLE_EMPRESA", "ROLE_BANCO"})
    public HttpResponse<Page<PedidoResponse>> listarTodos(Pageable pageable) {
        return HttpResponse.ok(pedidoService.listarTodos(pageable));
    }

    @Get("/{id}")
    public HttpResponse<PedidoResponse> buscarPorId(Long id) {
        return HttpResponse.ok(pedidoService.buscarPorId(id));
    }

    @Get("/cliente/{clienteId}")
    public HttpResponse<List<PedidoResponse>> listarPorCliente(Long clienteId) {
        return HttpResponse.ok(pedidoService.listarPorCliente(clienteId));
    }

    @Post
    @Status(HttpStatus.CREATED)
    @Secured("ROLE_CLIENTE")
    public PedidoResponse criar(@Body @Valid PedidoRequest request) {
        return pedidoService.criar(request);
    }

    @Delete("/{id}")
    public HttpResponse<PedidoResponse> cancelar(Long id) {
        return HttpResponse.ok(pedidoService.cancelar(id));
    }

    @Put("/{id}/status")
    @Secured({"ROLE_EMPRESA", "ROLE_BANCO"})
    public HttpResponse<PedidoResponse> alterarStatus(Long id, @Body @Valid PedidoStatusRequest request) {
        return HttpResponse.ok(pedidoService.alterarStatus(id, request.getNovoStatus()));
    }

    @Put("/{id}")
    public HttpResponse<PedidoResponse> modificar(Long id,
                                                   @Body @Valid PedidoUpdateRequest request,
                                                   Authentication authentication) {
        Map<String, Object> attrs = authentication.getAttributes();
        Long userId = Long.valueOf(attrs.get("userId").toString());
        String userType = attrs.get("userType").toString();
        return HttpResponse.ok(pedidoService.modificar(id, request.getAutomovelId(), userId, userType));
    }

    @Post("/{id}/credito")
    @Secured("ROLE_BANCO")
    @Status(HttpStatus.CREATED)
    public ContratoCreditoResponse concederCredito(Long id,
                                                    @Body @Valid CreditoRequest request,
                                                    Authentication authentication) {
        Map<String, Object> attrs = authentication.getAttributes();
        Long bancoId = Long.valueOf(attrs.get("userId").toString());
        return contratoService.concederCredito(id, bancoId, request.getValor());
    }
}
