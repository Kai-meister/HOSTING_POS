package com.pos.backend.service;

import com.pos.backend.dto.DashboardStats;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public DashboardStats getStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        long todaySales = orderRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        BigDecimal todayRevenue = orderRepository.sumTotalByCreatedAtBetween(startOfDay, endOfDay);
        long totalProducts = productRepository.countByActiveTrue();
        long lowStockCount = productRepository.countByActiveTrueAndStockLessThan(5);

        return new DashboardStats(
                todaySales,
                todayRevenue != null ? todayRevenue : BigDecimal.ZERO,
                totalProducts,
                lowStockCount
        );
    }
}
