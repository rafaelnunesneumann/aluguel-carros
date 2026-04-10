package com.aluguelcarros.service;

import com.aluguelcarros.dto.AgenteRequest;
import com.aluguelcarros.dto.AgenteResponse;
import com.aluguelcarros.exception.BusinessException;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.model.Agente;
import com.aluguelcarros.repository.AgenteRepository;
import jakarta.inject.Singleton;

import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class AgenteService {

    private final AgenteRepository agenteRepository;
    private final AuthService authService;

    public AgenteService(AgenteRepository agenteRepository, AuthService authService) {
        this.agenteRepository = agenteRepository;
        this.authService = authService;
    }

    public AgenteResponse criar(AgenteRequest req) {
        if (!req.getSenha().equals(req.getConfirmSenha())) {
            throw new BusinessException("Senhas não conferem");
        }
        if (agenteRepository.existsByLogin(req.getLogin())) {
            throw new BusinessException("Login já está em uso");
        }
        if (agenteRepository.existsByCnpj(req.getCnpj())) {
            throw new BusinessException("CNPJ já cadastrado");
        }
        Agente agente = Agente.builder()
                .login(req.getLogin())
                .senha(authService.hashPassword(req.getSenha()))
                .razaoSocial(req.getRazaoSocial())
                .cnpj(req.getCnpj())
                .endereco(req.getEndereco())
                .tipo(req.getTipo())
                .build();
        return toResponse(agenteRepository.save(agente));
    }

    public List<AgenteResponse> listarTodos() {
        return agenteRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AgenteResponse buscarPorId(Long id) {
        return toResponse(agenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado com id: " + id)));
    }

    public AgenteResponse atualizar(Long id, AgenteRequest req) {
        Agente agente = agenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado com id: " + id));
        agente.setRazaoSocial(req.getRazaoSocial());
        agente.setEndereco(req.getEndereco());
        agente.setTipo(req.getTipo());
        if (req.getSenha() != null && !req.getSenha().isBlank()) {
            if (!req.getSenha().equals(req.getConfirmSenha())) {
                throw new BusinessException("Senhas não conferem");
            }
            agente.setSenha(authService.hashPassword(req.getSenha()));
        }
        return toResponse(agenteRepository.update(agente));
    }

    public void deletar(Long id) {
        Agente agente = agenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado com id: " + id));
        agenteRepository.delete(agente);
    }

    public AgenteResponse toResponse(Agente agente) {
        return AgenteResponse.builder()
                .id(agente.getId())
                .razaoSocial(agente.getRazaoSocial())
                .cnpj(agente.getCnpj())
                .endereco(agente.getEndereco())
                .login(agente.getLogin())
                .tipo(agente.getTipo())
                .createdAt(agente.getCreatedAt())
                .build();
    }
}
