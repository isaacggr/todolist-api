package com.isaacggr.todolist.task;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ITaskRepository extends MongoRepository<TaskModel, String> {
    List<TaskModel> findByIdUser(String idUser);
}
