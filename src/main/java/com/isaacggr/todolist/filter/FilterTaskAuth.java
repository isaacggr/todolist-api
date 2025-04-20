package com.isaacggr.todolist.filter;

import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.isaacggr.todolist.user.IUserRepository;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FilterTaskAuth  extends OncePerRequestFilter { 

    @Autowired
    private IUserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        var servletPath = request.getServletPath();
        
        // Verifica se a rota começa com /tasks/ ou é o endpoint de verificação de usuário
        if (servletPath.startsWith("/tasks/") || servletPath.equals("/users/verify")){
            try {
                // pegar a autenticação (usuario e senha)
                var authorization = request.getHeader("Authorization");
                
                if(authorization == null || !authorization.startsWith("Basic ")) {
                    response.sendError(401, "Token de autorização não informado ou inválido");
                    return;
                }
                
                var authEncoded = authorization.substring("Basic".length()).trim();
                
                try {
                    byte[] authDecode = Base64.getDecoder().decode(authEncoded);
                    var authString = new String(authDecode);
                    
                    if (!authString.contains(":")) {
                        response.sendError(401, "Formato de autenticação inválido");
                        return;
                    }
                    
                    String[] credentials = authString.split(":");
                    String username = credentials[0];
                    String password = credentials[1];
    
                    // validar usuario
                    var user = this.userRepository.findByUsername(username);
                    if (user == null) {
                        response.sendError(401, "Usuário não encontrado");
                        return;
                    }
    
                    // validar senha
                    var passwordVerify = BCrypt.verifyer().verify(password.toCharArray(), user.getPassword());
                    if (passwordVerify.verified) {
                        request.setAttribute("idUser", user.getId());
                        filterChain.doFilter(request, response);
                    } else {
                        response.sendError(401, "Senha incorreta");
                    }
                } catch (IllegalArgumentException e) {
                    response.sendError(401, "Token de autorização inválido");
                }
            } catch (Exception e) {
                response.sendError(500, "Erro no servidor ao processar autenticação");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
