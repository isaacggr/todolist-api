package com.isaacggr.todolist.user;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface IUserRepository extends MongoRepository<UserModel, String> {
   UserModel findByUsername(String username);
}
