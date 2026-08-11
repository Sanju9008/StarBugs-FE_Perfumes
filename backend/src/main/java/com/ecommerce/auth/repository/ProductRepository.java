package com.ecommerce.auth.repository;

import com.ecommerce.auth.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"images", "category"})
    List<Product> findAll();

    List<Product> findByCategoryCategoryId(Long categoryId);
    List<Product> findByStockLessThanEqualOrderByStockAsc(int stock);
}
