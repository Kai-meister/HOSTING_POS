package com.pos.backend.service;

import com.pos.backend.dto.OrderItemRequest;
import com.pos.backend.dto.OrderRequest;
import com.pos.backend.entity.Order;
import com.pos.backend.entity.OrderItem;
import com.pos.backend.entity.Product;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Order> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Order not found with id: " + id));
    }

    @Transactional
    public Order create(OrderRequest request) {
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        Order order = new Order();
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setAmountPaid(request.getAmountPaid());
        order.setStatus("COMPLETED");
        order.setCreatedAt(LocalDateTime.now());

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Product not found with id: " + itemRequest.getProductId()));

            if (!product.getActive()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Product is not available: " + product.getName());
            }

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for product: " + product.getName()
                                + ". Available: " + product.getStock()
                                + ", Requested: " + itemRequest.getQuantity());
            }

            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setPrice(product.getPrice());
            item.setQuantity(itemRequest.getQuantity());
            item.setSubtotal(subtotal);

            orderItems.add(item);
            total = total.add(subtotal);
        }

        if ("CASH".equalsIgnoreCase(request.getPaymentMethod())) {
            if (request.getAmountPaid().compareTo(total) < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Amount paid is less than the total amount.");
            }
        }

        order.setTotal(total);
        order.setChange(request.getAmountPaid().subtract(total).max(BigDecimal.ZERO));
        order.setItems(orderItems);

        return orderRepository.save(order);
    }
}
