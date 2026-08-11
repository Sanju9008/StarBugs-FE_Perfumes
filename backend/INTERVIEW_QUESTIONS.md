# Top 50 Backend Interview Questions & Answers

Based on the technologies used in your E-commerce backend (Java 21, Spring Boot, Spring Security, JWT, Spring Data JPA, MySQL, Razorpay, Lombok), here are the top 50 interview questions along with their answers.

## Section 1: Java Core & Java 21

**1. What are the new features introduced in Java 21?**
**Answer:** Java 21 introduced Virtual Threads (Project Loom) for high-throughput concurrency, Record Patterns for more expressive data navigation, Pattern Matching for `switch`, and Sequenced Collections to represent collections with a defined encounter order.

**2. Explain the concept of Virtual Threads in Java 21.**
**Answer:** Virtual threads are lightweight threads managed by the JVM rather than the OS. They significantly reduce the effort of writing, maintaining, and observing high-throughput concurrent applications by allowing millions of threads to run concurrently without exhausting OS resources.

**3. What is a Record in Java?**
**Answer:** Introduced in Java 14 and finalized in Java 16, a `record` is a special class that acts as a transparent carrier for immutable data. It automatically generates constructors, accessor methods, `equals()`, `hashCode()`, and `toString()`, reducing boilerplate code similar to Lombok.

**4. How does Garbage Collection work in Java?**
**Answer:** Garbage Collection (GC) automatically frees up memory by destroying unreachable objects. The JVM periodically runs the GC process to look for objects with no references. Popular GC algorithms include G1 (default in newer Javas) and ZGC (low latency).

**5. What is the difference between Checked and Unchecked Exceptions?**
**Answer:** Checked exceptions are checked at compile-time (e.g., `IOException`), meaning you must handle them using `try-catch` or `throws`. Unchecked exceptions occur at runtime (e.g., `NullPointerException`) and do not need to be explicitly handled in the code.

**6. How does the Java Stream API work?**
**Answer:** The Stream API is used to process collections of objects in a functional style. It supports intermediate operations (like `map`, `filter`, which return a new stream) and terminal operations (like `collect`, `forEach`, which produce a result).

## Section 2: Spring Boot & Spring Framework

**7. What is the difference between Spring and Spring Boot?**
**Answer:** Spring is a comprehensive framework for Java applications requiring extensive manual configuration (XML or Java configs). Spring Boot is built on top of Spring, providing auto-configuration, embedded servers (like Tomcat), and starter dependencies to get applications up and running quickly.

**8. Explain the `@SpringBootApplication` annotation.**
**Answer:** It is a convenience annotation that combines three annotations: `@Configuration` (allows registering extra beans), `@EnableAutoConfiguration` (enables Spring Boot’s auto-configuration mechanism), and `@ComponentScan` (scans the package and sub-packages for Spring components).

**9. What is Dependency Injection (DI) and Inversion of Control (IoC)?**
**Answer:** IoC is a principle where the framework takes control of object creation and lifecycle. DI is the pattern used to implement IoC, where Spring injects required dependencies (Beans) into a class at runtime via constructor, setter, or field injection.

**10. What are the different Bean scopes in Spring?**
**Answer:** The primary scopes are **Singleton** (one instance per Spring context, default), **Prototype** (new instance every time requested), **Request** (one instance per HTTP request), **Session** (one per HTTP session), and **Application** (one per ServletContext).

**11. How does Spring Boot Auto-configuration work?**
**Answer:** Spring Boot looks at the JAR files in the classpath, the beans you have defined, and property settings, and automatically configures beans that it thinks you need. It is driven by the `@EnableAutoConfiguration` annotation and `spring.factories`.

**12. What is the difference between `@Controller` and `@RestController`?**
**Answer:** `@Controller` is used to return views (HTML/JSP) in an MVC pattern. `@RestController` combines `@Controller` and `@ResponseBody`, meaning it returns data (JSON/XML) directly in the HTTP response body instead of returning a view.

**13. How do you handle exceptions globally in Spring Boot?**
**Answer:** By using `@ControllerAdvice` or `@RestControllerAdvice` along with `@ExceptionHandler` methods. This allows you to catch specific exceptions thrown anywhere in the application and return a standardized error response.

**14. What are Spring Boot Actuators?**
**Answer:** Actuator provides production-ready features like health checks, metrics gathering, application information, and environment properties via HTTP endpoints.

**15. What is the Controller-Service-Repository pattern?**
**Answer:** It is a layered architecture pattern. **Controllers** handle HTTP requests and responses. **Services** contain business logic and transaction management. **Repositories** interact directly with the database.

## Section 3: Spring Data JPA & Hibernate

**16. What is the difference between JPA and Hibernate?**
**Answer:** JPA (Java Persistence API) is a specification/interface for ORM (Object-Relational Mapping) in Java. Hibernate is a specific implementation of the JPA specification.

**17. Explain `@Entity`, `@Table`, and `@Id`.**
**Answer:** `@Entity` marks a class as a JPA entity. `@Table` specifies the database table name. `@Id` marks the primary key field of the entity.

**18. What is the difference between `save()` and `saveAndFlush()` in JPA?**
**Answer:** `save()` persists the entity but might hold it in the Persistence Context cache until the transaction commits. `saveAndFlush()` executes the SQL insert/update immediately, forcing changes to the database right away.

**19. How do you write custom queries in Spring Data JPA?**
**Answer:** You can use derived query methods (e.g., `findByEmail(String email)`), or you can use the `@Query` annotation to write custom JPQL or native SQL queries.

**20. What is the N+1 problem in JPA?**
**Answer:** It occurs when an application executes 1 query to retrieve the parent entity, and then N additional queries to fetch its related children. It is solved using `JOIN FETCH` in JPQL, Entity Graphs, or batch fetching.

**21. Difference between `FetchType.LAZY` and `FetchType.EAGER`?**
**Answer:** `EAGER` fetching loads related entities immediately alongside the parent entity. `LAZY` fetching delays the loading of related entities until they are explicitly accessed by a getter method.

**22. How does `@Transactional` work?**
**Answer:** It wraps a method execution in a database transaction. If the method runs successfully, the transaction is committed. If an unchecked exception (RuntimeException) is thrown, the transaction is automatically rolled back.

**23. What are JPA Cascade Types?**
**Answer:** Cascade types define how entity state transitions (like persist, remove, merge) should cascade from a parent entity to its associated child entities (e.g., `CascadeType.ALL`, `CascadeType.REMOVE`).

**24. How do you implement Pagination in Spring Data JPA?**
**Answer:** By passing a `Pageable` object (created using `PageRequest.of(page, size)`) to a repository method. The repository then returns a `Page<T>` containing the data and metadata (total pages, current page).

**25. Explain the `@OneToMany` relationship.**
**Answer:** It represents a 1-to-many relationship in the database, like one User having multiple Orders. It is often mapped alongside a `@ManyToOne` on the child entity, using `mappedBy` to define the owning side.

## Section 4: Spring Security & JWT

**26. How does Spring Security work internally?**
**Answer:** Spring Security intercepts incoming requests using a chain of Servlet Filters (the `SecurityFilterChain`). These filters handle authentication, authorization, CSRF protection, and session management before the request reaches the controller.

**27. What is JWT and how does it work?**
**Answer:** JWT (JSON Web Token) is an open standard for securely transmitting information as a JSON object. After successful login, the server generates a JWT containing user details. The client sends this token in the `Authorization` header for subsequent requests to access protected routes.

**28. What are the three parts of a JWT?**
**Answer:** A JWT consists of a **Header** (algorithm and token type), a **Payload** (claims, i.e., the data like username and expiration), and a **Signature** (used to verify the token hasn't been altered, created using a secret key).

**29. What is the `UserDetailsService` interface?**
**Answer:** It is a core Spring Security interface with a single method, `loadUserByUsername()`. We implement this to load user-specific data from the database so Spring Security can compare credentials during login.

**30. How do you implement Role-Based Access Control?**
**Answer:** By assigning authorities/roles to a user object. In configurations, we use methods like `requestMatchers("/admin/**").hasRole("ADMIN")` or annotations like `@PreAuthorize("hasRole('ADMIN')")` on controllers.

**31. What is a `OncePerRequestFilter`?**
**Answer:** A Spring filter base class that guarantees a single execution per request. We often extend this to create our JWT authentication filter, extracting the token from the header and setting the security context.

**32. How do you handle JWT expiration?**
**Answer:** When the JWT expires, the server throws an `ExpiredJwtException`. The client receives a 401 Unauthorized error. Ideally, a "Refresh Token" mechanism is implemented so the client can silently fetch a new access token without re-login.

**33. How do you store passwords securely?**
**Answer:** Passwords should never be stored in plain text. In Spring Security, we use `BCryptPasswordEncoder` to hash passwords with a salt before saving them to the database.

**34. What is CORS and how do you resolve CORS errors in Spring Boot?**
**Answer:** Cross-Origin Resource Sharing (CORS) is a browser security mechanism that blocks requests to different domains. In Spring Boot, we allow CORS by using the `@CrossOrigin` annotation on controllers or configuring a global `CorsConfigurationSource` bean.

**35. What is CSRF and why is it disabled in JWT architectures?**
**Answer:** Cross-Site Request Forgery is an attack where unauthorized commands are submitted from a user that the web application trusts. Since JWTs are typically stored in localStorage and sent manually via headers (not cookies), they are immune to traditional CSRF attacks, so we disable CSRF in Spring Security.

## Section 5: RESTful APIs & Architecture

**36. What is a RESTful API?**
**Answer:** An architectural style using standard HTTP methods (GET, POST, PUT, DELETE) to manipulate resources identified by URIs. It is stateless, meaning no client state is stored on the server between requests.

**37. What is the difference between PUT and PATCH?**
**Answer:** `PUT` replaces the entire resource. `PATCH` applies partial modifications to a resource (updating only the fields provided).

**38. Explain common HTTP status codes.**
**Answer:** 
- 200 OK (Success)
- 201 Created (Resource created via POST)
- 400 Bad Request (Invalid client input)
- 401 Unauthorized (Missing or invalid authentication)
- 403 Forbidden (Authenticated, but lacks permission)
- 404 Not Found (Resource doesn't exist)
- 500 Internal Server Error (Server crash or unhandled exception).

**39. What is a DTO and why do we use it?**
**Answer:** Data Transfer Object. It is an object used to encapsulate data and send it over the network. We use DTOs to hide internal database entities, prevent over-posting vulnerabilities, and tailor JSON responses.

**40. How do you validate request payloads in Spring Boot?**
**Answer:** By adding the `@Valid` annotation to the `@RequestBody` parameter in the controller and adding validation annotations like `@NotBlank`, `@Email`, and `@Min` on the DTO fields.

**41. How do you handle file uploads in Spring Boot?**
**Answer:** By using the `MultipartFile` interface in the controller parameter. We can then save the file to local storage or an object storage service like AWS S3.

**42. How do you document APIs?**
**Answer:** Using Swagger/OpenAPI. By adding the `springdoc-openapi-starter-webmvc-ui` dependency, Spring Boot automatically generates interactive API documentation accessible via a UI endpoint.

## Section 6: E-commerce Logic, Integration & Tooling

**43. How does Razorpay payment integration work?**
**Answer:** First, the backend creates an Order via the Razorpay API and returns the Razorpay `order_id` to the frontend. The frontend processes the payment and receives a payment ID and signature. The backend then verifies the signature to ensure the payment is authentic before fulfilling the ecommerce order.

**44. What happens if a payment is interrupted? (Webhooks)**
**Answer:** To handle network drops, we configure Webhooks. Razorpay sends server-to-server HTTP POST requests to our backend when a payment succeeds or fails, allowing us to update the database status reliably even if the client disconnects.

**45. How do you send emails asynchronously in Spring Boot?**
**Answer:** Using `JavaMailSender`. To prevent email sending from blocking the main thread (causing slow API response times), we annotate the email-sending method with `@Async` to run it on a separate background thread.

**46. What is Lombok and how does it help?**
**Answer:** Lombok is a Java library that auto-generates boilerplate code like getters, setters, constructors, and builders at compile time via annotations like `@Data`, `@NoArgsConstructor`, and `@Builder`.

**47. Explain the Builder Pattern used in Java.**
**Answer:** The Builder pattern provides a flexible solution to object creation. Instead of using complex constructors with many parameters, it allows constructing complex objects step-by-step in a highly readable chain (e.g., provided by Lombok's `@Builder`).

**48. How would you design an inventory system to prevent "overselling"?**
**Answer:** By implementing database locking. We can use Optimistic Locking (using an `@Version` column to check for concurrent updates) or Pessimistic Locking (locking the row during a transaction) when decrementing product stock.

**49. How do you manage application properties for different environments (Dev/Prod)?**
**Answer:** By using Spring Profiles. We create `application-dev.yml` and `application-prod.yml` and activate the required profile using the `spring.profiles.active` environment variable.

**50. What is a mapped superclass in JPA?**
**Answer:** `@MappedSuperclass` is used on a base class (like an `Auditable` class containing `createdAt` and `updatedAt`) whose fields should be inherited by other Entity classes, but the base class itself does not have a database table.
