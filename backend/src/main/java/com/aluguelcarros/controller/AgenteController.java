package com.aluguelcarros.controller;

import com.aluguelcarros.dto.AgenteRequest;
import com.aluguelcarros.dto.AgenteResponse;
import com.aluguelcarros.service.AgenteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/agentes")
@Secured({"ROLE_EMPRESA", "ROLE_BANCO"})
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @Get
    public List<AgenteResponse> listarTodos() {
        return agenteService.listarTodos();
    }

    @Get("/{id}")
    public AgenteResponse buscarPorId(Long id) {
        return agenteService.buscarPorId(id);
    }

    @Put("/{id}")
    public AgenteResponse atualizar(Long id, @Body @Valid AgenteRequest request) {
        return agenteService.atualizar(id, request);
    }

    @Delete("/{id}")
    public HttpResponse<Void> deletar(Long id) {
        agenteService.deletar(id);
        return HttpResponse.noContent();
    }
}
