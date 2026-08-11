package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.CreateProductRequest;
import com.ecommerce.auth.entity.Category;
import com.ecommerce.auth.entity.Product;
import com.ecommerce.auth.entity.ProductImage;
import com.ecommerce.auth.repository.CategoryRepository;
import com.ecommerce.auth.repository.ProductImageRepository;
import com.ecommerce.auth.repository.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    // ─── GET /api/products ───────────────────────────────────────────────────
    @GetMapping
    @Cacheable("products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // ─── GET /api/products/{id} ───────────────────────────────────────────────
    @GetMapping("/{id}")
    @Cacheable(value = "products", key = "#id")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── POST /api/products (Admin Only) ──────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ResponseEntity<?> createProduct(@Valid @RequestBody CreateProductRequest request) {
        log.info("Creating new product: {}", request.getName());

        // Validate Category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product category. Category ID does not exist."));

        // Check for duplicate product name if needed
        boolean exists = productRepository.findAll().stream()
                .anyMatch(p -> p.getName().equalsIgnoreCase(request.getName().trim()));
        if (exists) {
            return ResponseEntity.badRequest().body(Map.of("message", "Product with name '" + request.getName() + "' already exists."));
        }

        Product product = Product.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);

        // Add Product Image if provided
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            ProductImage image = ProductImage.builder()
                    .product(savedProduct)
                    .imageUrl(request.getImageUrl().trim())
                    .build();
            productImageRepository.save(image);
        }

        log.info("Product created successfully with ID: {}", savedProduct.getProductId());
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.findById(savedProduct.getProductId()).get());
    }

    // ─── PUT /api/products/{id} (Admin Only) ──────────────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody CreateProductRequest request) {
        log.info("Updating product ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product category. Category ID does not exist."));

        // Check for duplicate product name if renamed
        boolean duplicate = productRepository.findAll().stream()
                .anyMatch(p -> !p.getProductId().equals(id) && p.getName().equalsIgnoreCase(request.getName().trim()));
        if (duplicate) {
            return ResponseEntity.badRequest().body(Map.of("message", "Product with name '" + request.getName() + "' already exists."));
        }

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        // Update image if provided
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            List<ProductImage> existingImages = savedProduct.getImages();
            if (existingImages != null && !existingImages.isEmpty()) {
                ProductImage firstImg = existingImages.get(0);
                firstImg.setImageUrl(request.getImageUrl().trim());
                productImageRepository.save(firstImg);
            } else {
                ProductImage newImg = ProductImage.builder()
                        .product(savedProduct)
                        .imageUrl(request.getImageUrl().trim())
                        .build();
                productImageRepository.save(newImg);
            }
        }

        log.info("Product updated successfully with ID: {}", id);
        return ResponseEntity.ok(productRepository.findById(id).get());
    }

    // ─── DELETE /api/products/{id} (Admin Only) ───────────────────────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        log.info("Deleting product ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));

        productRepository.delete(product);
        log.info("Product ID {} deleted successfully", id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product deleted successfully."
        ));
    }

    // ─── Exception Handling ──────────────────────────────────────────────────
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
    }
}
