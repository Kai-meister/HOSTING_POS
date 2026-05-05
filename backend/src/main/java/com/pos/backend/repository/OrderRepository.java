package com.pos.backend.repository;

import com.pos.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    BigDecimal sumTotalByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    List<Order> findAllByOrderByCreatedAtDesc();
}
