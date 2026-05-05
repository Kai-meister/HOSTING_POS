package com.pos.backend.service;

import com.pos.backend.entity.Category;
import com.pos.backend.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Category not found with id: " + id));
    }

    public Category create(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Category already exists with name: " + category.getName());
        }
        return categoryRepository.save(category);
    }

    public Category update(Long id, Category updatedCategory) {
        Category existing = findById(id);
        if (!existing.getName().equals(updatedCategory.getName())
                && categoryRepository.existsByName(updatedCategory.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Category already exists with name: " + updatedCategory.getName());
        }
        existing.setName(updatedCategory.getName());
        return categoryRepository.save(existing);
    }

    public void delete(Long id) {
        Category category = findById(id);
        categoryRepository.delete(category);
    }
}
