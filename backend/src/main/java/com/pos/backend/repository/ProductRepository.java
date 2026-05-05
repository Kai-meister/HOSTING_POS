package com.pos.backend.repository;

import com.pos.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    long countByActiveTrue();
    long countByActiveTrueAndStockLessThan(int stock);
}
