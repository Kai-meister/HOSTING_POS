package com.pos.backend.service;

import com.pos.backend.dto.ProductRequest;
import com.pos.backend.entity.Category;
import com.pos.backend.entity.Product;
import com.pos.backend.repository.CategoryRepository;
import com.pos.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> findAll() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> findByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + id));
    }

    public Product create(ProductRequest request) {
        Product product = new Product();
        mapRequestToProduct(request, product);
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = findById(id);
        mapRequestToProduct(request, product);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = findById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    private void mapRequestToProduct(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock() != null ? request.getStock() : 0);
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setActive(true);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
    }
}
