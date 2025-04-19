package com.isaacggr.todolist.task;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.isaacggr.todolist.utils.Utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private ITaskRepository taskRepository;

    @PostMapping("/")
    public ResponseEntity<?> create(@Valid @RequestBody TaskModel taskModel, HttpServletRequest request) {
        try {
            var idUser = request.getAttribute("idUser");
            taskModel.setIdUser(idUser.toString());

            var currentDate = LocalDateTime.now();
            if (currentDate.isAfter(taskModel.getStartAt()) || currentDate.isAfter(taskModel.getEndAt())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Data de início ou término não pode ser anterior à data atual");
            }
            if (taskModel.getStartAt().isAfter(taskModel.getEndAt())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Data de início deve ser menor do que a data de término");
            }

            var task = this.taskRepository.save(taskModel);
            return ResponseEntity.status(HttpStatus.OK).body(task);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/")
    public List<TaskModel> list(HttpServletRequest request) {
        var idUser = request.getAttribute("idUser");
        var tasks = this.taskRepository.findByIdUser(idUser.toString());
        return tasks;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody TaskModel taskModel, HttpServletRequest request, @PathVariable String id) {
        try {
            var task = this.taskRepository.findById(id);
            if (task.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tarefa não encontrada");
            }

            var idUser = request.getAttribute("idUser");
            if (idUser == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Usuário não identificado");
            }

            TaskModel existingTask = task.get();
            if (!existingTask.getIdUser().equals(idUser.toString())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Usuário não tem permissão para atualizar esta tarefa");
            }

            // Copiar apenas as propriedades não nulas
            Utils.copyNonNullProperties(taskModel, existingTask);
            
            // Validar datas apenas se ambas forem fornecidas
            if (taskModel.getStartAt() != null && taskModel.getEndAt() != null) {
                if (taskModel.getStartAt().isAfter(taskModel.getEndAt())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Data de início deve ser menor do que a data de término");
                }
            } else if (taskModel.getStartAt() != null) {
                if (taskModel.getStartAt().isAfter(existingTask.getEndAt())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Data de início deve ser menor do que a data de término");
                }
            } else if (taskModel.getEndAt() != null) {
                if (existingTask.getStartAt().isAfter(taskModel.getEndAt())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Data de início deve ser menor do que a data de término");
                }
            }

            var updatedTask = this.taskRepository.save(existingTask);
            return ResponseEntity.ok(updatedTask);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar tarefa: " + e.getMessage());
        }
    }
}

