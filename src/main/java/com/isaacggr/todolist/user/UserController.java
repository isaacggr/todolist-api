package com.isaacggr.todolist.user;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import at.favre.lib.crypto.bcrypt.BCrypt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Modificadores de acesso em java
 * public
 * private
 * protected
 */
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:8080", "https://web-production-a60ef.up.railway.app"})
public class UserController {

    @Autowired
    private IUserRepository userRepository;

    @PostMapping("/")
    public ResponseEntity<UserModel> createUser(@RequestBody UserModel userModel) {
        var user = this.userRepository.findByUsername(userModel.getUsername());

        if (user != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // User already exists
        }

        var passwordHashred = BCrypt.withDefaults()
            .hashToString(12, userModel.getPassword().toCharArray());

        userModel.setPassword(passwordHashred); // Hash the password

        var userCreated = this.userRepository.save(userModel);
        return ResponseEntity.ok(userCreated);
    }

    @PostMapping("/verify")
    public ResponseEntity<Object> verify(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Basic ")) {
            try {
                // A autenticação já foi verificada pelo filtro
                // Se chegamos aqui, o usuário está autenticado
                var idUser = request.getAttribute("idUser");
                if (idUser != null) {
                    var user = this.userRepository.findById(idUser.toString()).orElse(null);
                    if (user != null) {
                        // Retorna informações básicas do usuário (sem a senha)
                        Map<String, String> userInfo = new HashMap<>();
                        userInfo.put("id", user.getId());
                        userInfo.put("name", user.getName());
                        userInfo.put("username", user.getUsername());
                        
                        return ResponseEntity.ok(userInfo);
                    }
                }
            } catch (Exception e) {
                // Log do erro internamente
                System.err.println("Erro ao verificar credenciais: " + e.getMessage());
            }
        }
        
        // Se chegou aqui, a autenticação falhou
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }
}
