package com.aluguelcarros.controller;

import com.aluguelcarros.dto.AutomovelRequest;
import com.aluguelcarros.dto.AutomovelResponse;
import com.aluguelcarros.service.AutomovelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Controller("/automoveis")
@RequiredArgsConstructor
public class AutomovelController {

    private final AutomovelService automovelService;

    @Get
    public HttpResponse<List<AutomovelResponse>> listarTodos() {
        return HttpResponse.ok(automovelService.listarTodos());
    }

    @Get("/disponiveis")
    public HttpResponse<List<AutomovelResponse>> listarDisponiveis() {
        return HttpResponse.ok(automovelService.listarDisponiveis());
    }

    @Get("/{id}")
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
