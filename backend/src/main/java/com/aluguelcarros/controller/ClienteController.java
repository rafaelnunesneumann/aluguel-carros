package com.aluguelcarros.controller;

import com.aluguelcarros.dto.ClienteRequest;
import com.aluguelcarros.dto.ClienteResponse;
import com.aluguelcarros.service.ClienteService;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

@Controller("/clientes")
@Secured({"ROLE_EMPRESA", "ROLE_BANCO"})
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Get
    public HttpResponse<Page<ClienteResponse>> listarTodos(Pageable pageable) {
        return HttpResponse.ok(clienteService.listarTodos(pageable));
    }

    @Get("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
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
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<ClienteResponse> atualizar(Long id, @Body @Valid ClienteRequest request) {
        return HttpResponse.ok(clienteService.atualizar(id, request));
    }

    @Delete("/{id}")
    public HttpResponse<Void> deletar(Long id) {
        clienteService.deletar(id);
        return HttpResponse.<Void>ok();
    }
}
