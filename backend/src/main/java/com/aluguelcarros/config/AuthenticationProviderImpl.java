package com.aluguelcarros.config;

import com.aluguelcarros.model.Agente;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.service.AuthService;
import io.micronaut.core.async.publisher.Publishers;
import io.micronaut.http.HttpRequest;
import io.micronaut.security.authentication.AuthenticationProvider;
import io.micronaut.security.authentication.AuthenticationRequest;
import io.micronaut.security.authentication.AuthenticationResponse;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Singleton
public class AuthenticationProviderImpl implements AuthenticationProvider<HttpRequest<?>> {

    private final AuthService authService;

    public AuthenticationProviderImpl(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public Publisher<AuthenticationResponse> authenticate(
            HttpRequest<?> httpRequest,
            AuthenticationRequest<?, ?> authenticationRequest) {

        String login = authenticationRequest.getIdentity().toString();
        String password = authenticationRequest.getSecret().toString();

        // Try cliente first
        Optional<Cliente> clienteOpt = authService.findCliente(login);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            if (cliente.getSenha() != null && authService.verifyPassword(password, cliente.getSenha())) {
                Map<String, Object> attrs = new HashMap<>();
                attrs.put("userId", cliente.getId());
                attrs.put("userType", "CLIENTE");
                attrs.put("nome", cliente.getNome());
                return Publishers.just(AuthenticationResponse.success(login, List.of("ROLE_CLIENTE"), attrs));
            }
            return Publishers.just(AuthenticationResponse.failure("Credenciais inválidas"));
        }

        // Try agente
        Optional<Agente> agenteOpt = authService.findAgente(login);
        if (agenteOpt.isPresent()) {
            Agente agente = agenteOpt.get();
            if (authService.verifyPassword(password, agente.getSenha())) {
                Map<String, Object> attrs = new HashMap<>();
                attrs.put("userId", agente.getId());
                attrs.put("userType", agente.getTipo().name());
                attrs.put("nome", agente.getRazaoSocial());
                String role = "ROLE_" + agente.getTipo().name();
                return Publishers.just(AuthenticationResponse.success(login, List.of(role), attrs));
            }
            return Publishers.just(AuthenticationResponse.failure("Credenciais inválidas"));
        }

        return Publishers.just(AuthenticationResponse.failure("Usuário não encontrado"));
    }
}
