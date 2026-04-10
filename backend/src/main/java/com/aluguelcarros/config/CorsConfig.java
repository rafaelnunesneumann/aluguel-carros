package com.aluguelcarros.config;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;

@Filter("/**")
public class CorsConfig implements HttpServerFilter {

    private static final String ORIGIN  = "*";
    private static final String METHODS = "GET, POST, PUT, DELETE, OPTIONS";
    private static final String HEADERS = "Content-Type, Accept, Authorization, X-Requested-With";
    private static final String MAX_AGE = "1800";

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod().name())) {
            MutableHttpResponse<?> preflight = HttpResponse.ok()
                    .header("Access-Control-Allow-Origin",  ORIGIN)
                    .header("Access-Control-Allow-Methods", METHODS)
                    .header("Access-Control-Allow-Headers", HEADERS)
                    .header("Access-Control-Max-Age",       MAX_AGE);
            return io.micronaut.core.async.publisher.Publishers.just(preflight);
        }

        return io.micronaut.core.async.publisher.Publishers.map(
            chain.proceed(request),
            response -> {
                response.header("Access-Control-Allow-Origin",  ORIGIN);
                response.header("Access-Control-Allow-Methods", METHODS);
                response.header("Access-Control-Allow-Headers", HEADERS);
                return response;
            }
        );
    }
}
