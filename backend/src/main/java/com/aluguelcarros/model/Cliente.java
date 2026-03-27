package com.aluguelcarros.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    @Column(nullable = false, length = 150)
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos")
    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @NotBlank(message = "RG é obrigatório")
    @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
    @Column(nullable = false, length = 20)
    private String rg;

    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 255, message = "Endereço deve ter no máximo 255 caracteres")
    @Column(nullable = false)
    private String endereco;

    @Size(max = 100, message = "Profissão deve ter no máximo 100 caracteres")
    @Column(length = 100)
    private String profissao;

    @Email(message = "E-mail deve ser válido")
    @Column(length = 150)
    private String email;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    @Column(length = 20)
    private String telefone;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Size(max = 3, message = "Máximo de 3 rendimentos permitidos")
    @Builder.Default
    private List<Rendimento> rendimentos = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addRendimento(Rendimento rendimento) {
        if (rendimentos.size() >= 3) {
            throw new IllegalStateException("Cliente pode ter no máximo 3 rendimentos");
        }
        rendimentos.add(rendimento);
        rendimento.setCliente(this);
    }

    public void removeRendimento(Rendimento rendimento) {
        rendimentos.remove(rendimento);
        rendimento.setCliente(null);
    }
}
