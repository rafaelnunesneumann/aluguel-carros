package com.aluguelcarros.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Error;
import jakarta.validation.ConstraintViolationException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class GlobalExceptionHandler {

    private static final String CORS_ORIGIN  = "*";
    private static final String CORS_METHODS = "GET, POST, PUT, DELETE, OPTIONS";
    private static final String CORS_HEADERS = "Content-Type, Accept, Authorization, X-Requested-With";

    private <T> MutableHttpResponse<T> withCors(MutableHttpResponse<T> response) {
        return response
                .header("Access-Control-Allow-Origin",  CORS_ORIGIN)
                .header("Access-Control-Allow-Methods", CORS_METHODS)
                .header("Access-Control-Allow-Headers", CORS_HEADERS);
    }

    @Error(global = true, exception = ResourceNotFoundException.class)
    public HttpResponse<ErrorResponse> handleResourceNotFound(HttpRequest<?> request, ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.getCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return withCors(HttpResponse.status(HttpStatus.NOT_FOUND).body(error));
    }

    @Error(global = true, exception = BusinessException.class)
    public HttpResponse<ErrorResponse> handleBusinessException(HttpRequest<?> request, BusinessException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.getCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return withCors(HttpResponse.status(HttpStatus.CONFLICT).body(error));
    }

    @Error(global = true, exception = ConstraintViolationException.class)
    public HttpResponse<ErrorResponse> handleValidationErrors(HttpRequest<?> request, ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(cv -> {
            String path = cv.getPropertyPath().toString();
            String fieldName = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1) : path;
            errors.put(fieldName, cv.getMessage());
        });

        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.getCode())
                .message("Erro de validação")
                .timestamp(LocalDateTime.now())
                .errors(errors)
                .build();
        return withCors(HttpResponse.status(HttpStatus.BAD_REQUEST).body(errorResponse));
    }

    @Error(global = true, exception = IllegalStateException.class)
    public HttpResponse<ErrorResponse> handleIllegalState(HttpRequest<?> request, IllegalStateException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.getCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return withCors(HttpResponse.status(HttpStatus.BAD_REQUEST).body(error));
    }

    @Error(global = true)
    public HttpResponse<ErrorResponse> handleGenericException(HttpRequest<?> request, Throwable ex) {
        String msg = ex.getMessage() != null ? ex.getClass().getSimpleName() + ": " + ex.getMessage() : "Erro interno do servidor";
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.getCode())
                .message(msg)
                .timestamp(LocalDateTime.now())
                .build();
        return withCors(HttpResponse.<ErrorResponse>status(HttpStatus.INTERNAL_SERVER_ERROR).body(error));
    }
}
