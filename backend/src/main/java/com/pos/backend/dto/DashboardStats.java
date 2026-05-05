package com.pos.backend.dto;

import java.math.BigDecimal;

public class DashboardStats {

    private Long todaySales;
    private BigDecimal todayRevenue;
    private Long totalProducts;
    private Long lowStockCount;

    public DashboardStats() {}

    public DashboardStats(Long todaySales, BigDecimal todayRevenue, Long totalProducts, Long lowStockCount) {
        this.todaySales = todaySales;
        this.todayRevenue = todayRevenue;
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
    }

    public Long getTodaySales() { return todaySales; }
    public void setTodaySales(Long todaySales) { this.todaySales = todaySales; }
    public BigDecimal getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; }
    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }
    public Long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(Long lowStockCount) { this.lowStockCount = lowStockCount; }
}
