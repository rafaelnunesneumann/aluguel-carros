package com.aluguelcarros.controller;

import com.aluguelcarros.dto.AutomovelRequest;
import com.aluguelcarros.dto.AutomovelResponse;
import com.aluguelcarros.service.AutomovelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/automoveis")
@Secured({"ROLE_EMPRESA", "ROLE_BANCO"})
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @Get
    public HttpResponse<List<AutomovelResponse>> listarTodos() {
        return HttpResponse.ok(automovelService.listarTodos());
    }

    @Get("/disponiveis")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<List<AutomovelResponse>> listarDisponiveis() {
        return HttpResponse.ok(automovelService.listarDisponiveis());
    }

    @Get("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<AutomovelResponse> buscarPorId(Long id) {
        return HttpResponse.ok(automovelService.buscarPorId(id));
    }

    @Post
    @Status(HttpStatus.CREATED)
    public AutomovelResponse criar(@Body @Valid AutomovelRequest request) {
        return automovelService.criar(request);
    }

    @Put("/{id}")
    public HttpResponse<AutomovelResponse> atualizar(Long id, @Body @Valid AutomovelRequest request) {
        return HttpResponse.ok(automovelService.atualizar(id, request));
    }

    @Delete("/{id}")
    public HttpResponse<Void> deletar(Long id) {
        automovelService.deletar(id);
        return HttpResponse.<Void>ok();
    }
}
