package com.aluguelcarros.controller;

import com.aluguelcarros.dto.ClienteRequest;
import com.aluguelcarros.dto.ClienteResponse;
import com.aluguelcarros.service.ClienteService;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @Get
    public HttpResponse<Page<ClienteResponse>> listarTodos(Pageable pageable) {
        return HttpResponse.ok(clienteService.listarTodos(pageable));
    }

    @Get("/{id}")
    public HttpResponse<ClienteResponse> buscarPorId(Long id) {
        return HttpResponse.ok(clienteService.buscarPorId(id));
    }

    @Get("/cpf/{cpf}")
    public HttpResponse<ClienteResponse> buscarPorCpf(String cpf) {
        return HttpResponse.ok(clienteService.buscarPorCpf(cpf));
    }

    @Post
    @Status(HttpStatus.CREATED)
    public ClienteResponse criar(@Body @Valid ClienteRequest request) {
        return clienteService.criar(request);
    }

    @Put("/{id}")
    public HttpResponse<ClienteResponse> atualizar(Long id, @Body @Valid ClienteRequest request) {
        return HttpResponse.ok(clienteService.atualizar(id, request));
    }

    @Delete("/{id}")
    @Status(HttpStatus.NO_CONTENT)
    public void deletar(Long id) {
        clienteService.deletar(id);
    }
}
