package com.ecommerce.auth;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;

public class DbFix {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/ecommerce_db?serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "Sanju@2004";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {

            System.out.println("Connected to MySQL Database.");

            try {
                System.out.println("Renaming 'id' to 'user_id'...");
                stmt.execute("ALTER TABLE users CHANGE id user_id BIGINT AUTO_INCREMENT NOT NULL");
                System.out.println("Successfully renamed.");
            } catch (Exception e) {
                System.out.println("Rename might have already been done or encountered error: " + e.getMessage());
            }

            try {
                System.out.println("Dropping old columns 'full_name', 'mobile_number', 'is_active'...");
                stmt.execute("ALTER TABLE users DROP COLUMN full_name, DROP COLUMN mobile_number, DROP COLUMN is_active");
                System.out.println("Successfully dropped old columns.");
            } catch (Exception e) {
                System.out.println("Drop old columns might have already been done or encountered error: " + e.getMessage());
            }

            System.out.println("\n--- CURRENT 'users' TABLE STRUCTURE ---");
            ResultSet rs = stmt.executeQuery("DESCRIBE users");
            System.out.printf("%-15s | %-15s | %-5s | %-5s | %-15s\n", "Field", "Type", "Null", "Key", "Default");
            System.out.println("-------------------------------------------------------------------------");
            while (rs.next()) {
                System.out.printf("%-15s | %-15s | %-5s | %-5s | %-15s\n",
                        rs.getString("Field"),
                        rs.getString("Type"),
                        rs.getString("Null"),
                        rs.getString("Key"),
                        rs.getString("Default") != null ? rs.getString("Default") : "NULL");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
