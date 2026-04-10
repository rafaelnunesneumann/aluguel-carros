package com.aluguelcarros.service;

import com.aluguelcarros.dto.*;
import com.aluguelcarros.exception.BusinessException;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.model.ClienteStatus;
import com.aluguelcarros.model.Rendimento;
import com.aluguelcarros.repository.ClienteRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public Page<ClienteResponse> listarTodos(Pageable pageable) {
        return clienteRepository.findByStatus(ClienteStatus.ACTIVE, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findByIdAndStatus(id, ClienteStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        return toResponse(cliente);
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorCpf(String cpf) {
        Cliente cliente = clienteRepository.findByCpfAndStatus(cpf, ClienteStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com CPF: " + cpf));
        return toResponse(cliente);
    }

    @Transactional
    public ClienteResponse criar(ClienteRequest request) {
        // Se já existe com esse CPF mas está DELETED, reativa com os novos dados
        Cliente existente = clienteRepository.findByCpf(request.getCpf()).orElse(null);
        if (existente != null) {
            if (existente.getStatus() == ClienteStatus.DELETED) {
                return reativar(existente, request);
            }
            throw new BusinessException("Já existe um cliente cadastrado com o CPF: " + request.getCpf());
        }

        Cliente cliente = toEntity(request);
        cliente = clienteRepository.save(cliente);
        return toResponse(cliente);
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findByIdAndStatus(id, ClienteStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));

        if (clienteRepository.existsByCpfAndIdNotAndStatus(request.getCpf(), id, ClienteStatus.ACTIVE)) {
            throw new BusinessException("Já existe outro cliente cadastrado com o CPF: " + request.getCpf());
        }

        cliente.setNome(request.getNome());
        cliente.setCpf(request.getCpf());
        cliente.setRg(request.getRg());
        cliente.setEndereco(request.getEndereco());
        cliente.setProfissao(request.getProfissao());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());

        // Atualizar rendimentos
        cliente.getRendimentos().clear();
        if (request.getRendimentos() != null) {
            for (RendimentoRequest rendimentoReq : request.getRendimentos()) {
                Rendimento rendimento = Rendimento.builder()
                        .entidadeEmpregadora(rendimentoReq.getEntidadeEmpregadora())
                        .valor(rendimentoReq.getValor())
                        .cliente(cliente)
                        .build();
                cliente.getRendimentos().add(rendimento);
            }
        }

        cliente = clienteRepository.save(cliente);
        return toResponse(cliente);
    }

    @Transactional
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findByIdAndStatus(id, ClienteStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        cliente.setStatus(ClienteStatus.DELETED);
        clienteRepository.save(cliente);
    }

    // ---- Reativação ----

    private ClienteResponse reativar(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.getNome());
        cliente.setRg(request.getRg());
        cliente.setEndereco(request.getEndereco());
        cliente.setProfissao(request.getProfissao());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setStatus(ClienteStatus.ACTIVE);

        cliente.getRendimentos().clear();
        if (request.getRendimentos() != null) {
            for (RendimentoRequest rendimentoReq : request.getRendimentos()) {
                Rendimento rendimento = Rendimento.builder()
                        .entidadeEmpregadora(rendimentoReq.getEntidadeEmpregadora())
                        .valor(rendimentoReq.getValor())
                        .cliente(cliente)
                        .build();
                cliente.getRendimentos().add(rendimento);
            }
        }

        cliente = clienteRepository.save(cliente);
        return toResponse(cliente);
    }

    // ---- Mapeamento ----

    private Cliente toEntity(ClienteRequest request) {
        Cliente cliente = Cliente.builder()
                .nome(request.getNome())
                .cpf(request.getCpf())
                .rg(request.getRg())
                .endereco(request.getEndereco())
                .profissao(request.getProfissao())
                .email(request.getEmail())
                .telefone(request.getTelefone())
                .rendimentos(new ArrayList<>())
                .build();

        if (request.getRendimentos() != null) {
            for (RendimentoRequest rendimentoReq : request.getRendimentos()) {
                Rendimento rendimento = Rendimento.builder()
                        .entidadeEmpregadora(rendimentoReq.getEntidadeEmpregadora())
                        .valor(rendimentoReq.getValor())
                        .cliente(cliente)
                        .build();
                cliente.getRendimentos().add(rendimento);
            }
        }

        return cliente;
    }

    private ClienteResponse toResponse(Cliente cliente) {
        List<RendimentoResponse> rendimentoResponses = cliente.getRendimentos().stream()
                .map(r -> RendimentoResponse.builder()
                        .id(r.getId())
                        .entidadeEmpregadora(r.getEntidadeEmpregadora())
                        .valor(r.getValor())
                        .build())
                .collect(Collectors.toList());

        return ClienteResponse.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .cpf(cliente.getCpf())
                .rg(cliente.getRg())
                .endereco(cliente.getEndereco())
                .profissao(cliente.getProfissao())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .rendimentos(rendimentoResponses)
                .status(cliente.getStatus())
                .createdAt(cliente.getCreatedAt())
                .updatedAt(cliente.getUpdatedAt())
                .build();
    }
}
