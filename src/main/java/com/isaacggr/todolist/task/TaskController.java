package com.isaacggr.todolist.task;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.isaacggr.todolist.utils.Utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:8080")
public class TaskController {

    @Autowired
    private ITaskRepository taskRepository;

    @PostMapping("/")
    public ResponseEntity<?> create(@Valid @RequestBody TaskModel taskModel, HttpServletRequest request) {
        try {
            var idUser = request.getAttribute("idUser");
            taskModel.setIdUser(idUser.toString());

            // Validar apenas que data de início seja antes da data de término
            if (taskModel.getStartAt().after(taskModel.getEndAt())) {
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
                if (taskModel.getStartAt().after(taskModel.getEndAt())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Data de início deve ser menor do que a data de término");
                }
            } else if (taskModel.getStartAt() != null) {
                if (taskModel.getStartAt().after(existingTask.getEndAt())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Data de início deve ser menor do que a data de término");
                }
            } else if (taskModel.getEndAt() != null) {
                if (existingTask.getStartAt().after(taskModel.getEndAt())) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, HttpServletRequest request) {
        try {
            // Verificar se a tarefa existe
            var taskOptional = this.taskRepository.findById(id);
            if (taskOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tarefa não encontrada");
            }

            // Verificar se o usuário é o proprietário da tarefa
            var idUser = request.getAttribute("idUser");
            if (idUser == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Usuário não identificado");
            }
            
            TaskModel task = taskOptional.get();
            if (!task.getIdUser().equals(idUser.toString())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Usuário não tem permissão para excluir esta tarefa");
            }

            // Excluir a tarefa
            this.taskRepository.deleteById(id);
            
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Tarefa excluída com sucesso");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao excluir tarefa: " + e.getMessage());
        }
    }

    /**
     * Endpoint para alternar o status de conclusão de uma tarefa
     * @param id ID da tarefa a ser atualizada
     * @param request Requisição HTTP com os dados do usuário autenticado
     * @param statusUpdate Body da requisição com o status de conclusão (completed: true/false)
     * @return Tarefa atualizada ou mensagem de erro
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleTaskStatus(
            @PathVariable String id,
            HttpServletRequest request,
            @RequestBody Map<String, Boolean> statusUpdate) {
        
        try {
            // Verificar se a tarefa existe
            var taskOptional = this.taskRepository.findById(id);
            if (taskOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tarefa não encontrada");
            }

            // Verificar se o usuário é o proprietário da tarefa
            var idUser = request.getAttribute("idUser");
            if (idUser == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Usuário não identificado");
            }
            
            TaskModel task = taskOptional.get();
            if (!task.getIdUser().equals(idUser.toString())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Usuário não tem permissão para atualizar esta tarefa");
            }

            // Obter o novo status a partir do corpo da requisição
            Boolean completed = statusUpdate.get("completed");
            if (completed == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("O campo 'completed' é obrigatório");
            }
            
            // Atualizar o status da tarefa
            task.setCompleted(completed);
            
            // Se a tarefa foi marcada como concluída, registrar a data atual
            if (completed) {
                task.setCompletedAt(new Date());
            } else {
                task.setCompletedAt(null); // Limpar a data de conclusão se a tarefa for desmarcada
            }

            // Salvar as alterações
            TaskModel updatedTask = this.taskRepository.save(task);
            
            return ResponseEntity.ok(updatedTask);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar status da tarefa: " + e.getMessage());
        }
    }
}

