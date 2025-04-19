package com.isaacggr.todolist.user;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;

@Data
@Document(collection = "users")
public class UserModel {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;
    private String password;
    private String name;

    private LocalDateTime createdAt;
}
