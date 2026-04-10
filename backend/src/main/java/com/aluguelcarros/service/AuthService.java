package com.aluguelcarros.service;

import com.aluguelcarros.model.Agente;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.repository.AgenteRepository;
import com.aluguelcarros.repository.ClienteRepository;
import jakarta.inject.Singleton;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

@Singleton
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;

    public AuthService(ClienteRepository clienteRepository, AgenteRepository agenteRepository) {
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
    }

    public String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(12));
    }

    public boolean verifyPassword(String plainPassword, String hashed) {
        return BCrypt.checkpw(plainPassword, hashed);
    }

    public Optional<Cliente> findCliente(String login) {
        return clienteRepository.findByLogin(login);
    }

    public Optional<Agente> findAgente(String login) {
        return agenteRepository.findByLogin(login);
    }
}
