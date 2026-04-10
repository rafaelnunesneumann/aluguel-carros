package com.aluguelcarros.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String userType;
    private Long userId;
    private String nome;
    private String login;
}
