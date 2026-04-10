package com.aluguelcarros.controller;

import com.aluguelcarros.dto.PedidoRequest;
import com.aluguelcarros.dto.PedidoResponse;
import com.aluguelcarros.service.PedidoService;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Controller("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @Get
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
    public PedidoResponse criar(@Body @Valid PedidoRequest request) {
        return pedidoService.criar(request);
    }

    @Delete("/{id}")
    public HttpResponse<PedidoResponse> cancelar(Long id) {
        return HttpResponse.ok(pedidoService.cancelar(id));
    }
}
