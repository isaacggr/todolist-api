package com.isaacggr.todolist.user;

import org.springframework.web.bind.annotation.RestController;

import at.favre.lib.crypto.bcrypt.BCrypt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * Modificadores de acceso em java
 * public
 * private
 * protected
*/
@RestController
@RequestMapping("/users")
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
}
