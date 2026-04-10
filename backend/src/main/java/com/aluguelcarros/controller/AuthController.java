package com.aluguelcarros.controller;

import com.aluguelcarros.dto.*;
import com.aluguelcarros.service.AgenteService;
import com.aluguelcarros.service.ClienteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

@Controller("/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
public class AuthController {

    private final ClienteService clienteService;
    private final AgenteService agenteService;

    public AuthController(ClienteService clienteService, AgenteService agenteService) {
        this.clienteService = clienteService;
        this.agenteService = agenteService;
    }

    @Post("/register")
    public HttpResponse<ClienteResponse> registrarCliente(@Body @Valid RegisterClienteRequest request) {
        ClienteResponse response = clienteService.registrar(request);
        return HttpResponse.created(response);
    }

    @Post("/register/agente")
    public HttpResponse<AgenteResponse> registrarAgente(@Body @Valid AgenteRequest request) {
        AgenteResponse response = agenteService.criar(request);
        return HttpResponse.created(response);
    }
}
